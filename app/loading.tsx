"use client";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 dark:border-blue-400 border-solid"></div>
        <p className="text-blue-600 dark:text-blue-400 font-semibold">
          Loading...
        </p>
      </div>
    </div>
  );
}
