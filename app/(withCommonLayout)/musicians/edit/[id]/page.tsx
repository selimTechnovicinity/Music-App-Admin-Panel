"use client";
import { toast } from "@/hooks/use-toast";
import { getUserById, updateUserById } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const { id } = useParams();

  const router = useRouter();

  const [formData, setFormData] = useState<TUpdateData>({
    name: "",
    email: "",
    phone: "",
  });
  const [userData, setUserData] = useState<TUpdateData>({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(id as string);
        console.log(response.data);
        const userData = response?.data || "";
        if (userData) {
          // setFormData(userData);
          setUserData(userData);
          formData.name = userData?.name;
          formData.email = userData?.email;
          formData.phone = userData?.phone;
        } else {
          toast({ title: "Failed to update." });
        }
      } catch (err) {
        toast({ title: err as string });
      }
    };

    fetchUserData();
  }, [router, id]);

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
      if (res?.status === "success") {
        toast({ title: "Update successfull" });
        router.push("/musicians");
      } else {
        setError(res?.message);
        toast(res?.message);
      }
    } catch (error) {
      setError(error as string);
      toast({ title: error as string });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          Edit Musicians
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
              className="w-full p-2 border dark:border-none  rounded-md dark:bg-gray-700 dark:text-gray-200"
              value={formData?.name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block  text-gray-700 dark:text-gray-300 font-semibold mb-1"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              aria-label="Numero di Phone Number"
              placeholder="Numero di Phone Number"
              className="w-full p-2 border dark:border-none rounded-md dark:bg-gray-700 dark:text-gray-200"
              value={formData?.phone || ""}
              onChange={handleChange}
            />
          </div>

          {/* Display additional user data as non-editable */}
          <div className="w-full p-2 mt-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
            <strong>Email:</strong> {userData?.email || "N/A"}
          </div>
          <div className="w-full p-2 mt-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
            <strong>Role:</strong> {userData?.role || "N/A"}
          </div>
          <div className="w-full p-2 mt-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
            <strong>Status:</strong>{" "}
            {userData?.isActive ? "Active" : "Inactive"}
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
