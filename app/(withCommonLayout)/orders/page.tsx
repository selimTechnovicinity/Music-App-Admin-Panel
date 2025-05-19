"use client";

import API from "@/lib/axios-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiDollarSign,
  FiHome,
  FiPhone,
  FiTruck,
  FiUser,
} from "react-icons/fi";

interface Size {
  _id: string;
  label: string;
}

interface OrderItem {
  itemId: {
    _id: string;
    title: string;
    price: number;
    images: string[];
  };
  quantity: number;
  sizes: Size[];
}

interface Address {
  name: string;
  phone: string;
  address_1: string;
  address_2?: string;
  state: string;
  country: string;
  pincode: string;
}

interface Status {
  _id: string;
  status_name: string;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    photo: string;
  };
  items: OrderItem[];
  totalAmount: number;
  addressId: Address;
  status: Status;
  orderedAt: string;
  createdAt: string;
  musicianId: {
    _id: string;
    name: string;
    photo: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
  }, [pageNo, sortOption]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await API.post("/orders", {
        limit,
        sort: sortOption,
        page: pageNo,
      });
      setOrders(response.data.data.orders);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await API.get("/statuses");
      setStatuses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await API.post(`/orders/status/${orderId}`, { status: status });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all customer orders
          </p>
        </div>
        <div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="oldest">Oldest First</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Order ID: {order._id}
                  </h3>
                  <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                    <FiCalendar className="mr-2" />
                    <span>{formatDate(order.orderedAt)}</span>
                  </div>
                  {/* User and Musician Info */}
                  <div className="flex flex-wrap gap-4 mt-3">
                    <Link href={`/users/edit/${order?.userId?._id}`}>
                      <div className="flex items-center p-1 rounded-lg hover:bg-blue-100">
                        <img
                          src={order?.userId?.photo}
                          alt={order.userId.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm">
                          Customer: {order.userId.name}
                        </span>
                      </div>
                    </Link>
                    <Link href={`/users/edit/${order?.musicianId?._id}`}>
                      <div className="flex items-center p-1 rounded-lg hover:bg-blue-100">
                        <img
                          src={order.musicianId?.photo}
                          alt={order.musicianId.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm">
                          Artist: {order.musicianId.name}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-lg font-semibold">
                    <FiDollarSign className="mr-1" />
                    <span>{order?.totalAmount?.toFixed(2)}</span>
                  </div>
                  <select
                    value={order.status._id}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {statuses.map((status) => (
                      <option key={status._id} value={status._id}>
                        {status.status_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                  Items
                </h4>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={
                            item.itemId?.images[0] ||
                            "https://via.placeholder.com/100"
                          }
                          alt={item.itemId?.title || "item"}
                          className="h-20 w-20 rounded-md object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 dark:text-white">
                          {item.itemId?.title}
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.quantity} × ${item.itemId?.price.toFixed(2)}
                        </p>
                        {item.sizes.length > 0 && (
                          <div className="mt-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Sizes:{" "}
                              {item.sizes.map((size) => size.label).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                  Shipping Address
                </h4>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    <span>{order.addressId?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="mr-2" />
                    <span>{order.addressId?.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <FiHome className="mr-2 mt-1 flex-shrink-0" />
                    <span>
                      {order.addressId?.address_1}
                      {order.addressId.address_2 && (
                        <>, {order.addressId?.address_2}</>
                      )}
                      <br />
                      {order.addressId?.state}, {order.addressId?.country}
                      <br />
                      {order.addressId?.pincode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <FiTruck className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No orders found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            There are currently no orders available
          </p>
        </div>
      )}

      {/* Pagination */}
      {orders.length > 0 && (
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
