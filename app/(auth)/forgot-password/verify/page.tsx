"use client";

import { forgetPassword, submitOTP } from "@/lib/api";
import { getLocalStorage, setLocalStorage } from "@/utils/local-storage";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RESEND_OTP_DELAY = 30; // seconds

const SubmitOTP = () => {
  const [otp, setOTP] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    // Start the countdown if there is time left
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const otpData = {
        otp: otp,
      };
      const res = await submitOTP(otpData);
      if (res?.success === false) {
        toast.error(res?.message);
      } else if (res?.status === "success") {
        toast.success(res?.message);
        setLocalStorage("OTP", otp);
        router.push("/forgot-password/verify/reset-password");
      }
    } catch (error) {
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const email = getLocalStorage("email");
      if (!email) {
        router.push("/forgot-password");
      } else {
        const res = await forgetPassword({ email });
        if (res?.success === false) {
          toast.error(res?.message);
        } else if (res?.status === "success") {
          toast.success("OTP sent successfully.");
          setResendTimer(RESEND_OTP_DELAY);
        }
      }
    } catch (error) {
      toast.error(error as string);
    } finally {
      setResendLoading(false);
    }
  };

  return (
<div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
  <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-center text-blue-950 dark:text-white">
      Submit OTP
    </h2>
    <form className="mt-4" onSubmit={handleReset}>
      <input
        required
        placeholder="Enter OTP from your email"
        className="w-full p-2 mt-2 border dark:border-none rounded-md  dark:bg-gray-700 dark:text-white dark:border-gray-600"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 mt-4 bg-blue-950 text-white rounded-md cursor-pointer flex items-center justify-center transition ${
          loading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-800"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Submiting...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>

    <div className="mt-4 text-center">
      <button
        onClick={handleResendOTP}
        disabled={resendLoading || resendTimer > 0}
        className={`w-full p-2 mt-2 bg-blue-950 text-white rounded-md cursor-pointer transition ${
          resendLoading || resendTimer > 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-800"
        }`}
      >
        {resendLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Resending...
          </>
        ) : resendTimer > 0 ? (
          `Resend OTP in ${resendTimer}s`
        ) : (
          "Resend OTP"
        )}
      </button>
    </div>
  </div>
</div>
  );
};

export default SubmitOTP;
