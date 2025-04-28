"use client";

import Loading from "@/app/loading";
import { getAllUsers } from "@/lib/api";
import UsersTable from "@/ui/Users/UsersTable";
import Link from "next/link";
import { useEffect, useState } from "react";

export type TUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive?: boolean;
  __v?: number;
};

const Users = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 9;

  const user = [
    {
      id: "1",
      name: "John Doe",
      email: "",
      role: "user",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "",
      role: "user",
    },
    {
      id: "3",
      name: "John Smith",
      email: "",
      role: "user",
    },
    {
      id: "4",
      name: "Jane Smith",
      email: "",
      role: "user",
    },
    {
      id: "3",
      name: "John Smith",
      email: "",
      role: "user",
    },
    {
      id: "4",
      name: "Jane Smith",
      email: "",
      role: "user",
    },
    {
      id: "3",
      name: "John Smith",
      email: "",
      role: "user",
    },
    {
      id: "4",
      name: "Jane Smith",
      email: "",
      role: "user",
    },
    {
      id: "5",
      name: "John Doe",
      email: "",
      role: "user",
    },
    {
      id: "6",
      name: "Jane Doe",
      email: "",
      role: "user",
    },
    {
      id: "7",
      name: "John Smith",
      email: "",
      role: "user",
    },
    {
      id: "8",
      name: "Jane Smith",
      email: "",
      role: "user",
    },
    {
      id: "9",
      name: "John Doe",
      email: "",
      role: "user",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers("user", pageNo, limit);
        const usersData = res?.data?.users?.users;
        const totalUsers = res?.data?.users?.totalUsers;

        setUsers(usersData || []);
        setTotalPages(Math.ceil(totalUsers / limit));
      } catch {
        setError("No users found. Please add a user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pageNo]);

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
        <Link href="/operators/create">
          <button className="bg-blue-950 dark:bg-blue-800 text-white px-4 py-2 rounded-lg transition hover:bg-blue-800 dark:hover:bg-blue-700">
            + Add new user
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
          <UsersTable users={users} />

          {/* Pagination */}
          <div className=" left-0 w-ful  flex justify-center gap-2">
            <button
              onClick={handlePrev}
              disabled={pageNo === 1}
              className={`px-4 py-2 rounded-full ${
                pageNo === 1
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-950 dark:bg-blue-800 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition cursor-pointer"
              }`}
            >
              Previous
            </button>

            {getPaginationNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`px-4 py-2 rounded-full ${
                  pageNo === page
                    ? "bg-blue-950 dark:bg-blue-800 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={pageNo === totalPages}
              className={`px-4 py-2 rounded-full ${
                pageNo === totalPages
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-950 dark:bg-blue-800 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition cursor-pointer"
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
