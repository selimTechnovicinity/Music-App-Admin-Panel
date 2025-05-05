"use client";

import API from "@/lib/axios-client";
import AddGenreModal from "@/ui/Modal/AddGenreModal";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

interface Genre {
  _id: string;
  genre_name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await API.get(`/genres`);
      setGenres(res.data.data);
    } catch (err) {
      console.error("Error fetching genres:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/genres/${id}`);
      setGenres((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await API.post(`/genres/${editingId}`, {
          genre_name: formValue,
        });
      } else {
        await API.post(`/genres`, { genre_name: formValue });
      }
      setIsModalOpen(false);
      setFormValue("");
      setEditingId(null);
      fetchGenres();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const openEditModal = (genre: Genre) => {
    setFormValue(genre.genre_name);
    setEditingId(genre._id);
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
        <h1 className="text-2xl font-bold">Genres</h1>
        <button
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
            setEditingId(null);
            setFormValue("");
          }}
        >
          <FaPlus /> Add Genre
        </button>
      </div>

      <div className="my-5 mx-auto w-full max-w-6xl px-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-center text-gray-500 dark:text-gray-300">
            <thead>
              <tr className="bg-blue-100 dark:bg-gray-700">
                <th className="p-3">Genre</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => (
                <tr
                  key={genre._id}
                  className="even:bg-blue-100 odd:bg-white dark:even:bg-gray-800 dark:odd:bg-gray-900"
                >
                  <td className="p-3">{genre.genre_name}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(genre)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(genre._id)}
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

      <AddGenreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Genre" : "Add Genre"}
      >
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="e.g. Pop"
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
      </AddGenreModal>
    </div>
  );
}
