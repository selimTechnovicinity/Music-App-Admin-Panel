"use client";

import Loading from "@/app/loading";
import { getAllBookings } from "@/lib/api";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";

export type TBooking = {
  id: string;
  restaurant: {
    name: string;
    id: string;
  };
  operator: {
    name: string;
    email: string;
    role: string;
    id: string;
  };
  reservationTime: string;
  guests: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  customer?: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
};
export type TDateRange = {
  startDate: string;
  endDate: string;
};

const Bookings = () => {
  const [bookings, setBookings] = useState<TBooking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TBooking | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const limit = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const dateRange = { startDate: startDate, endDate: endDate };
        const res = await getAllBookings(
        
          sortBy,
          pageNo,
          limit,
          dateRange
        );
        const bookingData = res?.data?.reservations?.reservations;
        const totalBookings = res?.data?.reservations?.totalReservations;

        setBookings(bookingData || []);
        setTotalPages(Math.ceil(totalBookings / limit));
      } catch {
        setError("Impossibile recuperare le prenotazioni.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [pageNo, sortBy, startDate, endDate]);

  // Pagination Handlers
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

  const handleDateFilter = async () => {
    setPageNo(1);
    setLoading(true);
    try {
      const dateRange = {
        startDate: startDate,
        endDate: endDate,
      };
      const res = await getAllBookings(
        sortBy,
        pageNo,
        limit,
        dateRange
      );
      const bookingData = res?.data?.reservations?.reservations;
      const totalBookings = res?.data?.reservations?.totalReservations;

      setBookings(bookingData || []);
      setTotalPages(Math.ceil(totalBookings / limit));
    } catch (error) {
      toast.error(
        (error as string) || "Impossibile recuperare le prenotazioni."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = (booking: TBooking) => {
    setSelectedBooking(booking);
  };

  // Close modal
  const closeModal = () => {
    setSelectedBooking(null);
  };

  // if (loading) return <p className="text-center mt-10">Loading bookings...</p>;
  if (error)
    return (
      <p className="ml-140 text-center font-bold mt-40 bg-red-600 w-200 p-5 text-white">
        {error}
      </p>
    );

  return (
    <main className="flex dark:bg-gray-900 dark:text-gray-200">
      <div className="mb-10 mt-5 mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-wrap justify-between gap-4 mb-4 items-center">
          {/* Filter by Date */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col">
              <label className="block mb-1 text-sm">Data di inizio:</label>
              <input
                type="date"
                className="p-2 border rounded w-full max-w-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={dayjs(startDate).format("YYYY-MM-DD")}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="block mb-1 text-sm">Data di fine:</label>
              <input
                type="date"
                className="p-2 border rounded w-full max-w-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={dayjs(endDate).format("YYYY-MM-DD")}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <span>
              <button
                className="px-4 py-2 mt-6 bg-blue-950 text-white rounded-lg cursor-pointer hover:bg-blue-800 transition dark:bg-blue-800 dark:hover:bg-blue-700"
                onClick={handleDateFilter}
              >
                Applicare
              </button>
            </span>
          </div>

          {/* Sort By Button */}
          <div className="relative inline-block text-left mt-6">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="bg-blue-950 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer dark:bg-blue-800 dark:hover:bg-blue-700"
            >
              Ordina per:{" "}
              {sortBy === "latest" ? "Ultime novità" : "Il più vecchio"}
              <svg
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
                <ul className="py-2">
                  <li
                    className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                      sortBy === "latest"
                        ? "bg-gray-100 dark:bg-gray-700 font-semibold"
                        : ""
                    }`}
                    onClick={() => {
                      setSortBy("latest");
                      setDropdownOpen(false);
                    }}
                  >
                    Ultime novità
                  </li>
                  <li
                    className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                      sortBy === "oldest"
                        ? "bg-gray-100 dark:bg-gray-700 font-semibold"
                        : ""
                    }`}
                    onClick={() => {
                      setSortBy("oldest");
                      setDropdownOpen(false);
                    }}
                  >
                    Il più vecchio
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Booking List */}
        <div>
          {loading ? (
            <Loading />
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-300">
                <thead>
                  <tr className="bg-blue-100 dark:bg-gray-700">
                    <th className="p-3">RISTORANTE</th>
                    <th className="p-3">OPERATORE</th>
                    <th className="p-3">TEMPO DI PRENOTAZIONE</th>
                    <th className="p-3">TEMPO RISERVATO</th>
                    <th className="p-3">OSPITI</th>
                    <th className="p-3">STATO</th>
                    <th className="p-3">CLIENTE</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings?.map((booking, index) => (
                    <tr
                      key={index}
                      className="even:bg-blue-100 dark:even:bg-gray-800"
                    >
                      <td className="p-3">{booking?.restaurant?.name}</td>
                      <td className="p-3">{booking?.operator?.name}</td>
                      <td className="p-3">
                        {new Date(booking?.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3">
                        {new Date(booking?.reservationTime).toLocaleString()}
                      </td>
                      <td className="p-3">{booking?.guests}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-lg ${
                            booking?.status === "auto-rejected"
                              ? "bg-blue-800 text-white"
                              : booking?.status === "accepted"
                              ? "bg-green-500 text-white"
                              : booking?.status === "rejected"
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        >
                          {booking?.status === "auto-rejected"
                            ? "automatico rifiutata"
                            : booking?.status === "accepted"
                            ? "accettato"
                            : booking?.status === "rejected"
                            ? "rifiutato"
                            : "in attesa"}
                        </span>
                      </td>
                      <td
                        className="p-3 cursor-pointer"
                        onClick={() => handleBookingClick(booking)}
                      >
                        <BsPersonCircle />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className=" left-0 w-full flex justify-center gap-2 mt-5">
          <button
            onClick={handlePrev}
            disabled={pageNo === 1}
            className={`px-4 py-2 rounded-full ${
              pageNo === 1
                ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-950 dark:bg-blue-800 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition cursor-pointer"
            }`}
          >
            Precedente
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
            Avanti
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedBooking && (
        <div className="fixed inset-0  flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-10">
          <div className="bg-white overflow-y-auto dark:bg-gray-800 p-6 rounded-lg shadow-lg relative w-md max-w-200">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
            >
              <IoClose size={40} />
            </button>

            <h2 className="text-2xl font-semibold mt-4 mb-4 dark:text-gray-200">
              Informazioni sul cliente
            </h2>
            {selectedBooking?.customer ? (
              <div key={selectedBooking?.customer.id}>
                <p className="text-gray-700 dark:text-gray-300">
                  Nome: {selectedBooking?.customer?.customerName}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Telefono: {selectedBooking?.customer?.customerPhone}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Email: {selectedBooking?.customer?.customerEmail}
                </p>
                <div className="mt-3">
                  <p className="font-semibold dark:text-gray-300">Nota:</p>
                  <p className="text-gray-700 overflow-y-auto dark:text-gray-300 rounded-sm mt-1">
                    {selectedBooking?.notes}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-500 dark:text-gray-400">
                  Non sono disponibili informazioni sui clienti.
                </p>
                <div className="mt-2">
                  <p className="font-semibold dark:text-gray-300">Nota:</p>
                  <p className="text-gray-700 dark:text-gray-300 rounded-sm mt-1">
                    {selectedBooking?.notes}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Bookings;
