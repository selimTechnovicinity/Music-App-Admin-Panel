"use client";

import API from "@/lib/axios-client";
import { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiEye,
  FiEyeOff,
  FiMusic,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

interface Song {
  _id: string;
  title: string;
  photo: string;
}

interface User {
  _id: string;
  name: string;
  photo: string;
}

interface Album {
  _id: string;
  title: string;
  userId: User;
  price: number;
  songs: Song[];
  photo: string;
  isActive: boolean;
  createdAt: string;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, [searchQuery, sortOption, pageNo]);

  const fetchAlbums = async () => {
    try {
      const response = await API.get(
        `/albums?sort=${sortOption}&search=${searchQuery}&page=${pageNo}`
      );
      setAlbums(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAlbumStatus = async (albumId: string, currentStatus: boolean) => {
    try {
      await API.patch(`/albums/${albumId}/status`, {
        isActive: !currentStatus,
      });
      fetchAlbums();
    } catch (error) {
      console.error("Failed to update album status:", error);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Albums
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all music albums in the system
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search albums..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPageNo(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Album Grid */}
      {selectedAlbum ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {selectedAlbum.title} - Songs
              </h2>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="text-white bg-blue-950 p-3 rounded-sm dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
              >
                <div className="flex">
                  <MdOutlineArrowBackIosNew size={24} />
                  Back to Albums
                </div>
              </button>
            </div>
            <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
              <FiUser className="mr-1" />
              <span>{selectedAlbum.userId.name}</span>
              <FiDollarSign className="ml-3 mr-1" />
              <span>{selectedAlbum.price.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {selectedAlbum.songs.map((song) => (
              <div
                key={song._id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="relative aspect-square">
                  <img
                    src={song.photo}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 dark:text-white truncate">
                    {song.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <div
                key={album._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedAlbum(album)}
              >
                <div className="relative aspect-square">
                  <img
                    src={album.photo}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAlbumStatus(album._id, album.isActive);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full ${
                      album.isActive
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white shadow-md`}
                    title={album.isActive ? "Disable album" : "Enable album"}
                  >
                    {album.isActive ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
                    {album.title}
                  </h3>
                  <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                    <FiUser className="mr-1" />
                    <span className="truncate">{album.userId.name}</span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                    <FiDollarSign className="mr-1" />
                    <span>{album.price.toFixed(2)}</span>
                    <span className="ml-2 text-sm">
                      • {album.songs.length} song
                      {album.songs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(album.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {albums.length === 0 && (
            <div className="text-center py-12">
              <FiMusic className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No albums found
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "Try a different search term"
                  : "There are currently no albums available"}
              </p>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {!selectedAlbum && albums.length > 0 && (
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
