"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserById, updateUser } from "@/lib/api";
import { getUserInfo } from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type TUpdateData = {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  id?: string;
  __v?: number;
};

const EditUser = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | undefined>();

  useEffect(() => {
    const token = Cookies.get("refreshToken");
    setAccessToken(token);
  }, []);

  const decodedToken = accessToken ? getUserInfo(accessToken) : null;

  const [formData, setFormData] = useState<TUpdateData>({
    name: "",
    phone: "",
  });

  // Fetch user data
  const { data, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", decodedToken?.id],
    // queryFn: () => getUserById(decodedToken?.id),
    enabled: !!decodedToken?.id,
    queryFn: async () => {
      const data = await getUserById(decodedToken?.id);
      if (data?.data?.user?.role !== "super-admin") {
        toast.error("You are not authorized to access this page.");
        router.push("/login");
        return null;
      }
      setFormData({
        name: data?.data?.user?.name || "",
        phone: data?.data?.user?.phone || "",
      });
      return data;
    },
  });

  // Mutation to update user
  const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: (data: TUpdateData) => updateUser(data),
    onSuccess: (res) => {
      if (res?.data?.user) {
        toast.success("Updated successfully.");
        router.push("/update-profile");
      } else {
        toast.error(res?.message || "Failed to update.");
      }
    },
    onError: () => {
      toast.error("Failed to update. Please try again later.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );
    updateUserMutation(filteredData);
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Update Profile
        </h2>
        {data?.data?.user && (
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Phone Number"
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="w-full p-2 mt-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Email:</strong> {data?.data?.user?.email || "N/A"}
            </div>
            <div className="w-full p-2 mt-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Role:</strong> {data?.data?.user?.role || "N/A"}
            </div>
            <div className="w-full p-2 mt-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Status:</strong>{" "}
              {data?.data?.user?.isActive ? "Active" : "Inactive"}
            </div>

            <button
              type="submit"
              className={`w-full p-2 mt-4 bg-blue-950 dark:bg-blue-800 text-white rounded-md cursor-pointer flex items-center justify-center ${
                isPending ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUser;
