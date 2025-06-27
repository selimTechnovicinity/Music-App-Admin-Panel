"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiCalendar,
  FiEdit,
  FiLock,
  FiMail,
  FiSave,
  FiShield,
  FiUser,
} from "react-icons/fi";
import Image from "next/image";
import { getUser, updatePasswordFn, updateUser } from "@/lib/api";
import { toast } from "react-toastify";

export type TUpdateData = {
  name?: string;
  email?: string;
  bio?: string;
  role?: string;
  isActive?: boolean;
  id?: string;
  __v?: number;
};

export type PasswordFormData = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

export default function UserProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<TUpdateData>();
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
    watch,
  } = useForm<PasswordFormData>();

  const { data, isLoading: isUserLoading } = useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      const data = await getUser();
      resetProfile({
        name: data?.data.name || "",
        bio: data?.data?.bio || "",
      });
      return data;
    },
  });

  const { mutate: updateUserMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data: TUpdateData) => updateUser(data),
    onSuccess: (res) => {
      toast.success(res?.message || "User updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setIsEditing(false);
    },
    onError: () => {
      toast.error("Failed to update. Please try again later.");
    },
  });

  const { mutate: updatePasswordMutation, isPending: isUpdatingPassword } =
    useMutation({
      mutationFn: (data: PasswordFormData) => updatePasswordFn(data),
      onSuccess: () => {
        toast.success("Password updated successfully");
        setShowPasswordForm(false);
        resetPassword();
      },
      onError: () => {
        toast.error("Failed to update password");
      },
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedImage(files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const onProfileSubmit = (data: TUpdateData) => {
    const updateData: TUpdateData = {
      name: data.name,
      bio: data.bio,
    };
    updateUserMutation(updateData);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    updatePasswordMutation(data);
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">User Profile</h1>
              {!showPasswordForm && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                    isEditing
                      ? "bg-white text-blue-600"
                      : "bg-blue-700 text-white"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <FiSave className="inline" /> Save Changes
                    </>
                  ) : (
                    <>
                      <FiEdit className="inline" /> Edit Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {!showPasswordForm ? (
              <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Column - Avatar */}
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="relative mb-4">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={160}
                          height={160}
                          className="rounded-full border-4 border-white shadow-lg object-cover w-40 h-40"
                        />
                      ) : data?.data?.image ? (
                        <Image
                          src={data.data.image}
                          alt="Profile"
                          width={160}
                          height={160}
                          className="rounded-full border-4 border-white shadow-lg object-cover w-40 h-40"
                        />
                      ) : (
                        <div className="rounded-full bg-gray-200 w-40 h-40 flex items-center justify-center text-gray-500 text-4xl font-bold">
                          <FiUser size={48} />
                        </div>
                      )}

                      {isEditing && (
                        <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                          <label className="cursor-pointer">
                            <FiEdit className="text-blue-600" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      {isEditing ? (
                        <div className="space-y-4 w-full">
                          <div>
                            <input
                              {...registerProfile("name", {
                                required: "Name is required",
                              })}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              defaultValue={data?.data?.name}
                            />
                            {profileErrors.name && (
                              <p className="text-red-500 text-sm mt-1">
                                {profileErrors.name.message}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <h2 className="text-xl font-semibold">
                          {data?.data?.name}
                        </h2>
                      )}
                      <div className="mt-2 flex items-center justify-center gap-2 text-gray-600">
                        <FiShield className="text-blue-500" />
                        <span>{data?.data?.role || "User"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="w-full md:w-2/3 space-y-6">
                    {/* Email */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 text-gray-700 mb-2">
                        <FiMail className="text-blue-500" />
                        <h3 className="font-medium">Email Address</h3>
                      </div>
                      <p className="text-gray-900">{data?.data?.email}</p>
                    </div>

                    {/* Bio */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 text-gray-700 mb-2">
                        <FiUser className="text-blue-500" />
                        <h3 className="font-medium">Bio</h3>
                      </div>
                      {isEditing ? (
                        <textarea
                          {...registerProfile("bio")}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={data?.data?.bio}
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-900">
                          {data?.data?.bio || "No bio provided"}
                        </p>
                      )}
                    </div>

                    {/* Account Created */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 text-gray-700 mb-2">
                        <FiCalendar className="text-blue-500" />
                        <h3 className="font-medium">Account Created</h3>
                      </div>
                      <p className="text-gray-900">
                        {new Date(
                          data?.data?.createdAt || ""
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Password Reset */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 text-gray-700 mb-2">
                        <FiLock className="text-blue-500" />
                        <h3 className="font-medium">Password</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setImagePreview(null);
                        resetProfile({
                          name: data?.data?.name || "",
                          bio: data?.data?.bio || "",
                        });
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="max-w-lg mx-auto"
              >
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-center">
                    Change Password
                  </h2>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword("oldPassword", {
                        required: "Current password is required",
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {passwordErrors.oldPassword && (
                      <p className="text-red-500 text-sm">
                        {passwordErrors.oldPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword("password", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {passwordErrors.password && (
                      <p className="text-red-500 text-sm">
                        {passwordErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (val: string) => {
                          if (watch("password") !== val) {
                            return "Passwords do not match";
                          }
                        },
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
