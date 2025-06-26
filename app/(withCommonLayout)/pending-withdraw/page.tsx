"use client";

import API from "@/lib/axios-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsBank2 } from "react-icons/bs";
import { FaRegCopy, FaRegUserCircle } from "react-icons/fa";
import {
  FiCheck,
  FiClock,
  FiDollarSign,
  FiRefreshCw,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { GrDocumentNotes } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";

interface Withdrawal {
  _id: string;
  musicianId: {
    _id: string;
    name: string;
    photo: string;
  } | null;
  amount: number;
  status: "Completed" | "Processing" | "failed" | "Rejected";
  createdAt: string;
  updatedAt: string;
  note: string;
}

interface BankDetails {
  accountNumber: string;
  accountName: string;
  bankName: string;
  branchName?: string;
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [bankDetails, setbankDetails] = useState<BankDetails | null>();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState("");
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, [pageNo, searchQuery]);

  const fetchWithdrawals = async () => {
    try {
      const response = await API.get(
        `/withdrawals?page=${pageNo}&limit=${limit}&search=${searchQuery}`
      );
      setWithdrawals(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWithdrawalStatus = async (id: string, status: string) => {
    try {
      await API.post(`/withdrawals/${id}`, { status });
      fetchWithdrawals();
    } catch (error) {
      console.error("Failed to update withdrawal status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <FiCheck className="mr-1" size={16} />;
      case "Processing":
        return <FiRefreshCw className="mr-1 animate-spin" size={16} />;
      case "Failed":
        return <FiX className="mr-1" size={16} />;
      case "Rejected":
        return <FiX className="mr-1" size={16} />;
      default:
        return <FiClock className="mr-1" size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const closeModal = () => {
    setIsNoteOpen(false);
    setNote("");
    setbankDetails(null);
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

  const handleBankClick = async (id: string) => {
    try {
      const response = await API.get(`/bank-details/admin/${id}`);
      if (response.data) {
        setbankDetails({
          accountName: response?.data?.data[0]?.accountName,
          accountNumber: response?.data?.data[0]?.accountNo,
          bankName: response?.data?.data[0]?.bankName,
          branchName: response?.data?.data[0]?.branchName,
        });
      } else {
        setbankDetails(null);
      }
    } catch (error) {
      console.error("Failed to fetch bank details:", error);
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Withdrawal Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage musician withdrawal requests
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by musician name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPageNo(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  From
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Request Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Bank Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Notes
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {withdrawals.map((withdrawal) => (
                <tr
                  key={withdrawal._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {withdrawal.musicianId ? (
                      <Link href={`/users/edit/${withdrawal?.musicianId?._id}`}>
                        <div className="flex items-center rounded-lg hover:bg-blue-100">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={withdrawal.musicianId.photo}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {withdrawal.musicianId.name}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        No musician
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <FiDollarSign className="mr-1" />
                      {withdrawal.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        withdrawal.status
                      )}`}
                    >
                      {getStatusIcon(withdrawal.status)}
                      {withdrawal.status.charAt(0).toUpperCase() +
                        withdrawal.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(withdrawal.createdAt)}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => {
                      handleBankClick(withdrawal?.musicianId?._id || "");
                    }}
                  >
                    <BsBank2 />
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => {
                      setNote(withdrawal?.note);
                      setIsNoteOpen(true);
                    }}
                  >
                    <GrDocumentNotes />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <select
                          value={withdrawal.status}
                          onChange={(e) =>
                            updateWithdrawalStatus(
                              withdrawal._id,
                              e.target.value
                            )
                          }
                          className="appearance-none pl-3 pr-8 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white bg-no-repeat"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                            backgroundPosition: "right 0.5rem center",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "2rem",
                          }}
                        >
                          <option
                            value="Requested"
                            disabled={
                              withdrawal.status === "Processing" ||
                              withdrawal.status === "Completed" ||
                              withdrawal.status === "Rejected"
                            }
                          >
                            Requested
                          </option>
                          <option
                            value="Processing"
                            disabled={withdrawal.status === "Completed"}
                          >
                            Processing
                          </option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {withdrawals.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <FiDollarSign className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No withdrawal requests found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "Try a different search term"
              : "There are currently no withdrawal requests"}
          </p>
        </div>
      )}

      {/* Bank Details */}
      {bankDetails && (
        <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-10 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden transition-all transform">
            {/* Header */}
            <div className="bg-blue-950 dark:from-blue-600 dark:to-blue-700 p-5 flex justify-between items-start">
              {bankDetails?.accountName ? (
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-white/20">
                    <FaRegUserCircle color="white" />
                  </div>
                  <h2 className="text-xl font-bold text-white truncate max-w-xs">
                    {bankDetails?.accountName}
                  </h2>
                </div>
              ) : (
                <div></div>
              )}
              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <IoCloseSharp color="white" size={30} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {bankDetails?.accountNumber ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <RxDashboard />
                    <span className="text-sm font-medium">Account Number</span>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-lg font-semibold dark:text-white tracking-wider">
                        {bankDetails?.accountNumber}
                      </p>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            bankDetails?.accountNumber
                          )
                        }
                        className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        aria-label="Copy to clipboard"
                      >
                        <FaRegCopy />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white">
                  Bank Details Not Found
                </p>
              )}

              {/* Additional bank details can be added in this format */}
              {bankDetails.bankName && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <BsBank2 />
                    <span className="text-sm font-medium">Bank Name</span>
                  </div>
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white">
                    {bankDetails.bankName}
                  </p>
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <BsBank2 />
                    <span className="text-sm font-medium">Branch Name</span>
                  </div>
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white">
                    {bankDetails?.branchName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Note */}
      {isNoteOpen && (
        <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-10 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden transition-all transform">
            {/* Header */}
            <div className="bg-blue-950 dark:from-blue-600 dark:to-blue-700 p-5 flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-white/20">
                  <FaRegUserCircle color="white" />
                </div>
                <h2 className="text-xl font-bold text-white truncate max-w-xs">
                  Note
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <IoCloseSharp color="white" size={30} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {note ? (
                <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white">
                  {note}
                </p>
              ) : (
                <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white">
                  Note Not Found
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {withdrawals.length > 0 && (
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
