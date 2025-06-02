"use client";

import API from "@/lib/axios-client";
import AddStatusModal from "@/ui/Modal/AddStatusModal";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface Status {
  _id: string;
  status_name: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function StatusesPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await API.get(`/statuses`);
      setStatuses(res.data.data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/statuses/${id}`);
      fetchStatuses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await API.post(`/statuses/${editingId}`, {
          status_name: formValue,
        });
      } else {
        await API.post(`/statuses`, { status_name: formValue });
      }
      setIsModalOpen(false);
      setFormValue("");
      setEditingId(null);
      fetchStatuses();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (status: Status) => {
    setFormValue(status.status_name);
    setEditingId(status._id);
    setIsModalOpen(true);
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Order Statuses</h1>
        <button
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
            setEditingId(null);
            setFormValue("");
          }}
        >
          <FaPlus /> Add Status
        </button>
      </div>

      <div className="my-5 mx-auto w-full max-w-6xl px-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-center divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {statuses.map((status) => (
                <tr
                  key={status._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 justify-center text-center whitespace-nowrap">
                    {status.status_name}
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(status)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(status._id)}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        status.isDeleted === false
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                      }`}
                    >
                      {status.isDeleted === false ? (
                        <>
                          <FiEye className="mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <FiEyeOff className="mr-1" />
                          Show
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Status" : "Add Status"}
      >
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="e.g. Processing"
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Save
          </button>
        </div>
      </AddStatusModal>
    </div>
  );
}
