"use client";

import API from "@/lib/axios-client";
import { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiShoppingBag,
} from "react-icons/fi";

interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  photos: string[];
  isDeleted: boolean;
  sell_count: number;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [pageNo, searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await API.get(
        `/merchandises?page=${pageNo}&limit=${limit}&search=${searchQuery}`
      );
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string) => {
    try {
      await API.post(`/merchandises/hide/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product status:", error);
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
    return new Date(dateString).toLocaleDateString();
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
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all merchandise products
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPageNo(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div
            key={product._id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow ${
              product?.isDeleted ? "opacity-70" : ""
            }`}
          >
            <div className="relative aspect-square">
              <img
                src={
                  product?.images?.[0] ||
                  product?.photos?.[0] ||
                  "https://via.placeholder.com/300"
                }
                alt={product?.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProductStatus(product?._id);
                }}
                className={`absolute flex top-2 right-2 items-center px-3 py-1 rounded-md ${
                  !product?.isDeleted
                    ? "bg-green-400 dark:bg-green-900 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800"
                    : "bg-red-400 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                } text-white shadow-md`}
                title={
                  !product?.isDeleted ? "Disable product" : "Enable product"
                }
              >
                {!product?.isDeleted ? (
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
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1 line-clamp-2">
                {product?.title}
              </h3>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-800 dark:text-white">
                  <FiDollarSign className="mr-1" />
                  <span className="font-medium">
                    {product?.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FiShoppingBag className="mr-1" />
                  <span>{product?.sell_count} sold</span>
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Added: {formatDate(product.createdAt)}
              </div>

              {product?.isDeleted && (
                <div className="mt-2 text-sm text-red-500 dark:text-red-400">
                  (Hidden from customers)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <FiShoppingBag className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No products found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "Try a different search term"
              : "There are currently no products available"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {products.length > 0 && (
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
