"use client";

import API from "@/lib/axios-client";
import AddStatusModal from "@/ui/Modal/AddStatusModal";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

interface Status {
  _id: string;
  status_name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function StatusesPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await API.get(`/statuses`);
      setStatuses(res.data.data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/statuses/${id}`);
      setStatuses((prev) => prev.filter((s) => s._id !== id));
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
        console.log(formValue);
        await API.post(`/statuses`, { status_name: formValue });
      }
      setIsModalOpen(false);
      setFormValue("");
      setEditingId(null);
      fetchStatuses();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const openEditModal = (status: Status) => {
    setFormValue(status.status_name);
    setEditingId(status._id);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Statuses</h1>
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
          <table className="min-w-full text-sm text-center text-gray-500 dark:text-gray-300">
            <thead>
              <tr className="bg-blue-100 dark:bg-gray-700">
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((status) => (
                <tr
                  key={status._id}
                  className="even:bg-blue-100 odd:bg-white dark:even:bg-gray-800 dark:odd:bg-gray-900"
                >
                  <td className="p-3">{status.status_name}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(status)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(status._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
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
