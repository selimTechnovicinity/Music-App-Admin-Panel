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
  phone: string;
  role: "user" | "musician" | "admin";
  isActive: boolean;
  __v: number;
};

const Users = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 9;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers(pageNo, limit);
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
          <UsersTable users={users} />

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
              Precedente
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
              Avanti
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Users;
