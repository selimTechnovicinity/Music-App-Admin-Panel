"use client";

import { getSongFormats } from "@/lib/api";
import API from "@/lib/axios-client";
import AddSongFormatModal from "@/ui/Modal/AddSongFormatModal";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

interface SongFormat {
  _id: string;
  song_format: string;
}

export default function SongFormatsPage() {
  const [formats, setFormats] = useState<SongFormat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    fetchFormats();
  }, []);

  const fetchFormats = async () => {
    try {
      const res = await getSongFormats();
      setFormats(res.data.data);
    } catch (err) {
      console.error("Error fetching formats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/song_formats/${id}`);
      setFormats((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await API.post(`/song_formats/${editingId}`, {
          song_format: formValue,
        });
      } else {
        await API.post(`/song_formats`, { song_format: formValue });
      }
      setIsModalOpen(false);
      setFormValue("");
      setEditingId(null);
      fetchFormats();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const openEditModal = (format: SongFormat) => {
    setFormValue(format.song_format);
    setEditingId(format._id);
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
        <h1 className="text-2xl font-bold">Song Formats</h1>
        <button
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
            setEditingId(null);
            setFormValue("");
          }}
        >
          <FaPlus /> Add Format
        </button>
      </div>

      <div className="my-5 mx-auto w-full max-w-6xl px-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-center text-gray-500 dark:text-gray-300">
            <thead>
              <tr className="bg-blue-100 dark:bg-gray-700">
                <th className="p-3">Format</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formats.map((format) => (
                <tr
                  key={format._id}
                  className="even:bg-blue-100 odd:bg-white dark:even:bg-gray-800 dark:odd:bg-gray-900"
                >
                  <td className="p-3">{format.song_format}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(format)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(format._id)}
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

      <AddSongFormatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Format" : "Add Format"}
      >
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="e.g. mp3"
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
      </AddSongFormatModal>
    </div>
  );
}
