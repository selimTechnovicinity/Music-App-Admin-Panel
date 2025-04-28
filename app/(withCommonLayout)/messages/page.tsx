"use client";

import Loading from "@/app/loading";
import { getContacts } from "@/lib/api";
import { useEffect, useState } from "react";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";

type Contact = {
  name: string;
  email: string;
  subject: string;
  message: string;
  role: string;
  restaurantId?: string;
  super_adminId?: string;
  createdAt: string;
  id: string;
};

const ITEMS_PER_PAGE = 7;

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch contact messages
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getContacts();
        if (response?.contact) {
          setContacts(response?.contact);
          setTotalPages(Math.ceil(response?.contact?.length / ITEMS_PER_PAGE));
        } else {
          toast.error("Impossibile recuperare i messaggi di contatto.");
        }
      } catch (error) {
        toast.error(
          (error as string) || "Impossibile recuperare i messaggi di contatto."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pagination handlers
  const handlePageClick = (page: number) => {
    setPageNo(page);
  };

  const handlePrev = () => {
    if (pageNo > 1) setPageNo(pageNo - 1);
  };

  const handleNext = () => {
    if (pageNo < totalPages) setPageNo(pageNo + 1);
  };

  // Get current page data
  const currentContacts = contacts.slice(
    (pageNo - 1) * ITEMS_PER_PAGE,
    pageNo * ITEMS_PER_PAGE
  );

  // Modal close handler
  const closeModal = () => {
    setSelectedMessage(null);
    setSelectedSubject(null);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, pageNo - 2);
    const endPage = Math.min(totalPages, pageNo + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-6 text-center">
          Messaggi
        </h1>
        <div>
          {loading && <Loading />}
          {currentContacts?.length > 0 ? (
            <div className="overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-950 text-white">
                    <th className="p-3 border-b">Nome</th>
                    <th className="p-3 border-b">Email</th>
                    <th className="p-3 border-b">Ruolo</th>
                    <th className="p-3 border-b">Data</th>
                    <th className="p-3 border-b">Messaggi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentContacts?.map((contact) => (
                    <tr
                      key={contact?.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="p-3 border-b dark:text-white">
                        {contact?.name}
                      </td>
                      <td className="p-3 border-b dark:text-white">
                        {contact?.email}
                      </td>
                      <td className="p-3 border-b dark:text-white">
                        <span
                          className={`px-2 py-1 text-xs rounded-lg ${
                            contact?.role === "operator"
                              ? "bg-blue-500 text-white"
                              : "bg-orange-500 text-white"
                          }`}
                        >
                          {contact?.role === "operator"
                            ? "operatore"
                            : contact?.role === "restaurant"
                            ? "ristorante"
                            : contact?.role}
                        </span>
                      </td>
                      <td className="p-3 border-b sm:text-sm dark:text-white">
                        {new Date(contact?.createdAt).toLocaleString()}
                      </td>
                      <td
                        className="p-3 border-b cursor-pointer dark:text-white"
                        onClick={() => {
                          setSelectedMessage(contact?.message);
                          setSelectedSubject(contact?.subject);
                        }}
                      >
                        <FaEnvelopeOpenText />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              {!currentContacts && (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Non sono stati trovati messaggi di contatto.
                </p>
              )}
            </>
          )}
        </div>

        {/* Scrollable Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 mt-15 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white dark:bg-gray-800 max-w-lg w-full p-6 rounded-lg shadow-lg relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-red-600 cursor-pointer transition hover:text-red-800"
              >
                <IoClose size={40} />
              </button>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold dark:text-white">
                  Oggetto: {selectedSubject}
                </h2>
              </div>
              <div className="max-h-80 overflow-y-auto p-4 rounded bg-gray-50 dark:bg-gray-700">
                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                  {selectedMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className=" left-0 w-full mt-5 flex justify-center gap-2">
          <button
            onClick={handlePrev}
            disabled={pageNo === 1}
            className={`px-4 py-2 rounded-full ${
              pageNo === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                : "bg-blue-950 text-white cursor-pointer hover:bg-blue-800 transition dark:hover:bg-blue-700"
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
                  ? "bg-blue-950 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white cursor-pointer hover:bg-gray-300 transition"
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
                ? "bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                : "bg-blue-950 text-white cursor-pointer hover:bg-blue-800 transition dark:hover:bg-blue-700"
            }`}
          >
            Avanti
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
