"use client";
import { TUser } from "@/app/(withCommonLayout)/users/page";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

export default function UsersTable({ users }: { users: TUser[] }) {
  return (
    <div className="my-5 mx-auto w-full max-w-6xl px-4">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-300">
          <thead>
            <tr className="bg-blue-100 dark:bg-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
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
                      user?.role === "Users"
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {user?.role === "users" ? "Users" : user?.role}
                  </span>
                </td>
                <td className="p-3">
                  {/* <ToggleButton status={user?.isActive} id={{ id: user?.id }} /> */}
                </td>
                <td className="p-3 flex space-x-2">
                  <Link href={`/users/edit/${user?.id}`}>
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
  );
}
