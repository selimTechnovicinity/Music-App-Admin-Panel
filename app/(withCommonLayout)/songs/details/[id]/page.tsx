"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import API from "@/lib/axios-client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiPause, FiPlay, FiVolume2 } from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";

export default function SongPage() {
  const [song, setSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isFavorite, setIsFavorite] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchSong();
  }, [id]);

  const fetchSong = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(`/songs/${id}`);
      console.log(response.data);
      setSong(response.data.data);
      setIsFavorite(response.data.data.is_favourite);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch song:", error);
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 dark:text-gray-400">Song not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={song.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={handleTimeUpdate}
      />
      <div
        className="flex items-center text-2xl mb-2 cursor-pointer h-10 w-20 rounded-md text-blue-950 dark:text-white dark:bg-blue-950 dark:hover:bg-blue-900 dark:border-blue-900"
        onClick={handleBack}
      >
        <IoChevronBack />
        Back
      </div>
      {/* Song Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <img
            src={song.photo}
            alt={song.title}
            className="w-64 h-64 rounded-lg object-cover shadow-md"
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {song.title}
          </h1>
          <Link href={`/users/edit/${song?.userId?._id}`}>
            <div className="flex items-center gap-4 my-2 hover:bg-blue-100 p-1 rounded-lg">
              <img
                src={song.userId.photo}
                alt={song.userId.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  {song.userId.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Musician</p>
              </div>
            </div>
          </Link>

          {/* Song Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Plays</p>
              <p className="text-lg font-semibold">{song.totalPlay}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Purchases
              </p>
              <p className="text-lg font-semibold">{song.sell_count}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
              <p className="text-lg font-semibold">${song.price.toFixed(2)}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Released
              </p>
              <p className="text-lg font-semibold">
                {new Date(song.releaseDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {song.genres.map((genre: any) => (
              <span
                key={genre._id}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {genre.genre_name}
              </span>
            ))}
            {song.moods.map((mood: any) => (
              <span
                key={mood._id}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
              >
                {mood.mood_name}
              </span>
            ))}
            {song.languageId && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                {song.languageId.language_name}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Player Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-blue-950 text-white rounded-full flex items-center justify-center cursor-pointer transition"
          >
            {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
          </button>
        </div>
      {/* Progress Bar */}
      <div className="mb-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                (currentTime / (duration || 1)) * 100
              }%, #e5e7eb ${
                (currentTime / (duration || 1)) * 100
              }%, #e5e7eb 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      {/* Volume Control */}
      <div className="flex items-center gap-2">
          <FiVolume2 size={16} className="text-gray-500 dark:text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                volume * 100
              }%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
