"use client";

import API from "@/lib/axios-client";
import AddMoodModal from "@/ui/Modal/AddMoodModal";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface Mood {
  _id: string;
  mood_name: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function MoodsPage() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const res = await API.get(`/moods`);
      setMoods(res.data.data);
    } catch (err) {
      console.error("Error fetching moods:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/moods/${id}`);
      fetchMoods();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await API.post(`/moods/${editingId}`, {
          mood_name: formValue,
        });
      } else {
        await API.post(`/moods`, { mood_name: formValue });
      }
      setIsModalOpen(false);
      setFormValue("");
      setEditingId(null);
      fetchMoods();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const openEditModal = (mood: Mood) => {
    setFormValue(mood.mood_name);
    setEditingId(mood._id);
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
        <h1 className="text-2xl font-bold">Moods</h1>
        <button
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
            setEditingId(null);
            setFormValue("");
          }}
        >
          <FaPlus /> Add Mood
        </button>
      </div>

      <div className="my-5 mx-auto w-full max-w-6xl px-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-center divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-3">Mood</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {moods.map((mood) => (
                <tr
                  key={mood._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 justify-center text-center whitespace-nowrap">
                    {mood.mood_name}
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(mood)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(mood._id)}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        mood.isDeleted === false
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                      }`}
                    >
                      {mood.isDeleted === false ? (
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

      <AddMoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Mood" : "Add Mood"}
      >
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="e.g. Energetic"
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
      </AddMoodModal>
    </div>
  );
}
