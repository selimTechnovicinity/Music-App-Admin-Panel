"use client";

import Loading from "@/app/loading";
import { getAllUsers } from "@/lib/api";
import API from "@/lib/axios-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "musician" | "admin";
  isDeleted: boolean;
  __v: number;
};

const Users = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 9;

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers("musician", pageNo, limit);
      const usersData = res?.data;
      const totalPages = res?.totalPages;

      setUsers(usersData || []);
      setTotalPages(totalPages);
    } catch {
      setError("Musicians data not found");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [pageNo]);

  const toggleStatus = async (userId: string) => {
    try {
      await API.post(`/users/hide/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update song status:", error);
    }
  };

  // Pagination Handlers
  const handleNext = () => {
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const handlePageClick = (page: number) => {
    setPageNo(page);
  };
  const getPaginationNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, pageNo - 2);
    const endPage = Math.min(totalPages, pageNo + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <main className="my-10 mx-auto w-full max-w-6xl px-4">
      <div className="flex justify-end mr-5">
        <Link href="/musicians/create">
          <button className="bg-blue-950 dark:bg-blue-800 cursor-pointer text-white px-4 py-2 rounded-lg transition hover:bg-blue-800 dark:hover:bg-blue-700">
            + Add new musician
          </button>
        </Link>
      </div>
      {error ? (
        <p className="ml-40 text-center font-bold mt-40 bg-red-600 w-200 p-5 text-white">
          {error}
        </p>
      ) : (
        <div>
          {loading && <Loading />}
          <div className="my-5 mx-auto w-full max-w-6xl px-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-300">
                <thead>
                  <tr className="bg-blue-100 dark:bg-gray-700">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Phone Number</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className="even:bg-blue-100 odd:bg-white dark:even:bg-gray-800 dark:odd:bg-gray-900"
                    >
                      <td className="p-3">{user?.name}</td>
                      <td className="p-3">{user?.phone}</td>
                      <td className="p-3">{user?.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-lg ${
                            user?.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {user?.role === "user" ? "User" : user?.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleStatus(user._id)}
                          className={`flex items-center px-3 py-1 rounded-md ${
                            user.isDeleted === false
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                          }`}
                        >
                          {user.isDeleted === false ? (
                            <>
                              <FiEye className="mr-1" />
                              Block
                            </>
                          ) : (
                            <>
                              <FiEyeOff className="mr-1" />
                              Unblock
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-3 flex space-x-2">
                        <Link href={`/users/edit/${user?._id}`}>
                          <button className="cursor-pointer text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition">
                            <FaEdit />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="left-0 w-full flex justify-center gap-2">
            <button
              onClick={handlePrev}
              disabled={pageNo === 1}
              className={`px-4 py-2 rounded-full transition ${
                pageNo === 1
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-950 dark:bg-blue-800 text-white cursor-pointer hover:bg-blue-800 dark:hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            {getPaginationNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`px-4 py-2 rounded-full transition ${
                  pageNo === page
                    ? "bg-blue-950 dark:bg-blue-800 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={pageNo === totalPages}
              className={`px-4 py-2 rounded-full transition ${
                pageNo === totalPages
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-950 dark:bg-blue-800 text-white cursor-pointer hover:bg-blue-800 dark:hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Users;
