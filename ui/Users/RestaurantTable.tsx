"use client";
import { TUser } from "@/app/(withCommonLayout)/musicians/page";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import ToggleButton from "../ToggleButton";

export default function RestaurantTable({ users }: { users: TUser[] }) {
  return (
    <div className="my-5 mx-auto w-full max-w-6xl px-4">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-300">
          <thead>
            <tr className="bg-blue-100 dark:bg-gray-700">
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Telefono</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Ruolo</th>
              <th className="p-3 text-left">Stato</th>
              <th className="p-3 text-left">Modifica</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr
                key={user?.id}
                className="even:bg-blue-100 odd:bg-white dark:even:bg-gray-800 dark:odd:bg-gray-900"
              >
                <td className="p-3">{user?.name}</td>
                <td className="p-3">{user?.phone}</td>
                <td className="p-3">{user?.email}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                      user?.role === "restaurant"
                        ? "bg-orange-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {user?.role === "restaurant" ? "ristorante" : user?.role}
                  </span>
                </td>
                <td className="p-3">
                  <ToggleButton status={user?.isActive} id={{ id: user?.id }} />
                </td>
                <td className="p-3 flex space-x-2">
                  <Link href={`/restaurants/edit/${user?.id}`}>
                    <button className="cursor-pointer hover:text-blue-500 dark:hover:text-blue-300">
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
