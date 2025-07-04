"use client";
import { getUserById, updateUserById } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export type TUpdateData = {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  id?: string;
  __v?: number;
  photo?: string | null;
  bio?: string;
  genres?: string[];
  isVerified?: boolean;
  country?: string | null;
  total_earning?: number;
  total_latest_earning?: number;
  total_song_earning?: number;
  total_product_earning?: number;
  total_donation_earning?: number;
};

const EditUser = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState<TUpdateData>({
    name: "",
    bio: "",
  });
  const [userData, setUserData] = useState<TUpdateData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(id as string);
        const userData = response?.data || {};
        if (userData) {
          setUserData(userData);
          setFormData({
            name: userData.name || "",
            // phone: userData.phone || "",
          });
        } else {
          toast.error("Failed to load user data.");
        }
      } catch (err) {
        toast.error((err as string) || "Error loading user data");
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await updateUserById(id as string, formData);

      toast.success(res?.message || "User updated successfully.");
    } catch (error) {
      setError(error as string);
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          Edit Musician
        </h2>
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
              aria-label="Name"
              placeholder="Name"
              className="w-full p-2 border dark:border-none rounded-md dark:bg-gray-700 dark:text-gray-200"
              value={formData?.name || ""}
              onChange={handleChange}
            />
          </div>

          {/* Display all user data as non-editable */}
          <div className="space-y-2 mt-4">
            <div className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Email:</strong> {userData?.email || "N/A"}
            </div>
            <div className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Role:</strong> {userData?.role || "N/A"}
            </div>
            {/* <div className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Status:</strong>{" "}
              {userData?.isActive ? "Active" : "Inactive"}
            </div> */}
            <div className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Verified:</strong> {userData?.isVerified ? "Yes" : "No"}
            </div>
            <div className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 break-words overflow-auto">
              <strong>Bio:</strong> {userData?.bio || "N/A"}
            </div>
            <div className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Total Earnings:</strong> $
              {userData?.total_earning?.toFixed(2) || "0.00"}
            </div>
            <div className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Available Balance:</strong> $
              {userData?.total_latest_earning?.toFixed(2) || "0.00"}
            </div>
            <div className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Song Earnings:</strong> $
              {userData?.total_song_earning?.toFixed(2) || "0.00"}
            </div>
            <div className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Product Earnings:</strong> $
              {userData?.total_product_earning?.toFixed(2) || "0.00"}
            </div>
            <div className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              <strong>Donation Earnings:</strong> $
              {userData?.total_donation_earning?.toFixed(2) || "0.00"}
            </div>
          </div>

          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}

          <button
            type="submit"
            className={`w-full p-2 mt-4 bg-blue-950 text-white rounded-md cursor-pointer flex items-center justify-center ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
