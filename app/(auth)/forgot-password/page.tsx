"use client";
import { toast } from "@/hooks/use-toast";
import { forgetPassword } from "@/lib/api";
import { setLocalStorage } from "@/utils/local-storage";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await forgetPassword({ email });
      if (res?.success === false) {
        toast({ title: res?.message });
      } else if (res?.status === "success") {
        toast({ title: res?.message });
        setLocalStorage("email", email);
        router.push("/forgot-password/verify");
      }
    } catch (error) {
      toast({ title: error as string });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-950 dark:text-white">
          Enter your email
        </h2>
        <form className="mt-4" onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mt-2 border dark:border-none rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
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
      </div>
    </div>
  );
};

export default ForgotPassword;
