"use client";

import { getSongFormats } from "@/lib/api";
import API from "@/lib/axios-client";
import AddSongFormatModal from "@/ui/Modal/AddSongFormatModal";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface SongFormat {
  _id: string;
  isDeleted: boolean;
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
      fetchFormats();
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
          <table className="min-w-full text-sm text-center divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Format
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
              {formats.map((format) => (
                <tr
                  key={format._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 justify-center text-center whitespace-nowrap">
                    {format.song_format}
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(format)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(format._id)}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        format.isDeleted === false
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                      }`}
                    >
                      {format.isDeleted === false ? (
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
