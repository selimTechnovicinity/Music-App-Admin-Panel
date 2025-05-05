"use client";

import API from "@/lib/axios-client";
import AddLanguageModal from "@/ui/Modal/AddLanguageModal";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

interface Language {
  _id: string;
  language_name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function LanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const res = await API.get(`/languages`);
      setLanguages(res.data.data);
    } catch (err) {
      console.error("Error fetching languages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/languages/${id}`);
      setLanguages((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await API.post(`/languages/${editingId}`, {
          language_name: formValue,
        });
      } else {
        await API.post(`/languages`, { language_name: formValue });
      }
      setIsModalOpen(false);
      setFormValue("");
      setEditingId(null);
      fetchLanguages();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const openEditModal = (language: Language) => {
    setFormValue(language.language_name);
    setEditingId(language._id);
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
        <h1 className="text-2xl font-bold">Languages</h1>
        <button
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
            setEditingId(null);
            setFormValue("");
          }}
        >
          <FaPlus /> Add Language
        </button>
      </div>

      <div className="my-5 mx-auto w-full max-w-6xl px-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-center text-gray-500 dark:text-gray-300">
            <thead>
              <tr className="bg-blue-100 dark:bg-gray-700">
                <th className="p-3">Language</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((language) => (
                <tr
                  key={language._id}
                  className="even:bg-blue-100 odd:bg-white dark:even:bg-gray-800 dark:odd:bg-gray-900"
                >
                  <td className="p-3">{language.language_name}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(language)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(language._id)}
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

      <AddLanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Language" : "Add Language"}
      >
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="e.g. English"
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
      </AddLanguageModal>
    </div>
  );
}
