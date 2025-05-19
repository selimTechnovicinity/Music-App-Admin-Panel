"use client";

import API from "@/lib/axios-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiClock,
  FiDollarSign,
  FiEye,
  FiEyeOff,
  FiMusic,
  FiSearch,
} from "react-icons/fi";

interface User {
  _id: string;
  name: string;
  photo: string;
}

interface Song {
  _id: string;
  title: string;
  photo: string;
  audio: string;
  price: number;
  userId: User;
  playCount: number;
  releaseDate: string;
  createdAt: string;
  isDeleted?: boolean;
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>();

  useEffect(() => {
    fetchSongs();
  }, [searchQuery, pageNo]);

  const fetchSongs = async () => {
    try {
      const response = await API.post("/songs/users/all", {
        page: pageNo,
        limit: limit,
        search: searchQuery,
      });
      console.log(response.data.data);
      setSongs(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSongStatus = async (songId: string) => {
    try {
      await API.post(`/songs/hide/${songId}`);
      fetchSongs();
    } catch (error) {
      console.error("Failed to update song status:", error);
    }
  };

  const handleNext = () => {
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const handlePageClick = (page: number) => {
    setPageNo(page);
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, pageNo - 2);
    const endPage = Math.min(totalPages, pageNo + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Songs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all songs in the system
          </p>
        </div>

        {/* search  */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search song..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPageNo(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Songs List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Song
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Artist
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Plays
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Date Added
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {songs.map((song) => (
                <tr
                  key={song._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/songs/details/${song?._id}`}>
                      <div className="flex items-center rounded-lg p-1 hover:bg-blue-100">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={song?.photo || "/public/default-image.webp"}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {song?.title}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/users/edit/${song?.userId?._id}`}>
                      <div className="flex items-center rounded-lg p-1 hover:bg-blue-100">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              song?.userId?.photo ||
                              "/public/default-image.webp"
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {song.userId.name}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white flex items-center">
                      <FiDollarSign className="mr-1" />
                      {song.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {song.playCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white flex items-center">
                      <FiClock className="mr-1" />
                      {new Date(song.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleSongStatus(song._id)}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        song.isDeleted === false
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                      }`}
                    >
                      {song.isDeleted === false ? (
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

      {/* Empty State */}
      {songs.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <FiMusic className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No songs found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            There are currently no songs available
          </p>
        </div>
      )}

      {/* Pagination */}
      {songs.length > 0 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={handlePrev}
            disabled={pageNo === 1}
            className={`px-4 py-2 rounded-full ${
              pageNo === 1
                ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-950 dark:bg-blue-800 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition cursor-pointer"
            }`}
          >
            Previous
          </button>

          {getPaginationNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-4 py-2 rounded-full ${
                pageNo === page
                  ? "bg-blue-950 dark:bg-blue-800 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={pageNo === totalPages}
            className={`px-4 py-2 rounded-full ${
              pageNo === totalPages
                ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-950 dark:bg-blue-800 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
