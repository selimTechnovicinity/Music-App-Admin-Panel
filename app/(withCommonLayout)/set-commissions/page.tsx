"use client";

import API from "@/lib/axios-client";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  FiDollarSign,
  FiGift,
  FiMusic,
  FiPercent,
  FiSave,
} from "react-icons/fi";

interface CommissionRates {
  product_commission: number;
  song_commission: number;
  donation_commission: number;
}

export default function CommissionPage() {
  const [commissions, setCommissions] = useState<CommissionRates>({
    product_commission: 0,
    song_commission: 0,
    donation_commission: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/commissions");
      setCommissions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch commissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Ensure value is between 0 and 100
    const numericValue = Math.min(100, Math.max(0, Number(value)));
    setCommissions((prev) => ({ ...prev, [name]: numericValue }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await API.post("/commissions", commissions);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save commissions:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <FiPercent className="text-2xl text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Commission Rates
          </h1>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-950 hover:bg-blue-700 text-white rounded-md"
          >
            <FaEdit className="mr-2" />
            Edit Commissions
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Product Purchase Commission */}
        <div
          className={`p-6 ${isEditing ? "bg-blue-50 dark:bg-gray-700" : ""}`}
        >
          <div className="flex items-center mb-4">
            <FiGift className="text-xl text-blue-600 mr-3" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Product Purchase Commission
            </h2>
          </div>
          <div className="flex items-center">
            {isEditing ? (
              <div className="relative rounded-md shadow-sm w-32">
                <input
                  type="number"
                  name="product_commission"
                  value={commissions.product_commission}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="block w-full pr-12 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">%</span>
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {commissions.product_commission}%
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Percentage taken from each product sale
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Song Purchase Commission */}
        <div
          className={`p-6 ${isEditing ? "bg-blue-50 dark:bg-gray-700" : ""}`}
        >
          <div className="flex items-center mb-4">
            <FiMusic className="text-xl text-blue-600 mr-3" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Song Purchase Commission
            </h2>
          </div>
          <div className="flex items-center">
            {isEditing ? (
              <div className="relative rounded-md shadow-sm w-32">
                <input
                  type="number"
                  name="song_commission"
                  value={commissions.song_commission}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="block w-full pr-12 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">%</span>
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {commissions.song_commission}%
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Percentage taken from each song purchase
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Donation Commission */}
        <div
          className={`p-6 ${isEditing ? "bg-blue-50 dark:bg-gray-700" : ""}`}
        >
          <div className="flex items-center mb-4">
            <FiDollarSign className="text-xl text-blue-600 mr-3" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Donation Commission
            </h2>
          </div>
          <div className="flex items-center">
            {isEditing ? (
              <div className="relative rounded-md shadow-sm w-32">
                <input
                  type="number"
                  name="donation_commission"
                  value={commissions.donation_commission}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="block w-full pr-12 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">%</span>
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {commissions.donation_commission}%
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Percentage taken from each donation
          </p>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg border border-yellow-200 dark:border-gray-600">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Important Note
          </h3>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            Changing commission rates will affect all future transactions but
            won&apos;t modify existing ones.
          </p>
        </div>
      )}
    </div>
  );
}
