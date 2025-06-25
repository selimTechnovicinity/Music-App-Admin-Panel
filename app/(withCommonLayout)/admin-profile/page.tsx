"use client";
import { toast } from "@/hooks/use-toast";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUser, updateUser } from "@/lib/api";
import { getUserInfo } from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type TUpdateData = {
  name?: string;
  email?: string;
  bio?: string;
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
    bio: "",
  });

  // Fetch user data
  const { data, isLoading: isUserLoading } = useQuery({
    queryKey: ["admin", decodedToken?.id],
    // queryFn: () => getUserById(decodedToken?.id),
    queryFn: async () => {
      const data = await getUser();
      // if (data?.data?.user?.role !== "admin") {
      //   toast.error("You are not authorized to access this page.");
      //   router.push("/login");
      //   return null;
      // }
      setFormData({
        name: data?.data.name || "",
        bio: data?.data?.bio || "",
      });
      return data;
    },
  });

  // Mutation to update user
  const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: (data: TUpdateData) => updateUser(data),
    onSuccess: (res) => {
      if (res?.data?.user) {
        toast({ title: res?.message || "User updated successfully." });
        router.push("/update-profile");
      } else {
        toast({ title: res?.message || "Failed to update." });
      }
    },
    onError: () => {
      toast({
        title: "Failed to update. Please try again later.",
        variant: "default",
      });
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Update Profile
        </h2>
        {data?.data && (
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 dark:text-gray-300 font-semibold "
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
                htmlFor="bio"
                className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
              >
                Bio
              </label>
              <input
                type="text"
                id="bio"
                name="bio"
                placeholder="Bio"
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 mt-4">
              <div className="w-full p-2 mt-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                <strong>Email:</strong> {data?.data?.email || "N/A"}
              </div>
              <div className="w-full p-2 mt-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                <strong>Role:</strong> {data?.data?.role || "N/A"}
              </div>
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
