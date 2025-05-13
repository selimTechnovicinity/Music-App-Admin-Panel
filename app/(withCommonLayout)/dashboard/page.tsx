"use client";

import API from "@/lib/axios-client";
import {
  DollarSign,
  Headphones,
  Mic2,
  Music,
  Radio,
  Store,
  User,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Summary Card Component
const SummaryCard = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div className="flex justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
          {value}
        </h3>
      </div>
      <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center">
        {icon}
      </div>
    </div>
    {change && (
      <p className="mt-2 text-sm font-medium text-green-500">
        {change} <span className="text-gray-500">vs last month</span>
      </p>
    )}
  </div>
);


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalMusicians: 0,
    totalSongs: 0,
    totalAlbums: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalPosts: 0,
    totalTransactions: 0,
    totalDonations: 0,
    totalOrdersRevenue: 0,
    totalMusicsRevenue: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [genreData, setGenreData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const res = await API.get("/genres/song-count");
        if (res.data.success) {
          const transformed = res.data.data.map(
            (genre: { genre_name: string; songCount: number }) => ({
              name: genre.genre_name,
              value: genre.songCount,
            })
          );
          setGenreData(transformed);
        }
      } catch (error) {
        console.error("Failed to fetch genre data", error);
      }
    };

    fetchGenreData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get("/users/admin/dashboard");
      setDashboardData(res.data.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
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
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900">
      {/* Top Summary Cards - Expanded */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Users"
          value={dashboardData.totalUsers.toLocaleString()}
          icon={<User className="h-6 w-6 text-blue-500" />}
        />
        <SummaryCard
          title="Total Artists"
          value={dashboardData.totalMusicians.toLocaleString()}
          icon={<Mic2 className="h-6 w-6 text-blue-500" />}
        />
        <SummaryCard
          title="Songs Uploaded"
          value={dashboardData.totalSongs.toLocaleString()}
          icon={<Music className="h-6 w-6 text-blue-500" />}
        />
        <SummaryCard
          title="Total Music Albums"
          value={dashboardData.totalAlbums.toLocaleString()}
          icon={<Wallet className="h-6 w-6 text-blue-500" />}
        />
      </div>

      {/* Second Row Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Products"
          value={dashboardData.totalProducts.toLocaleString()}
          icon={<Store className="h-6 w-6 text-green-500" />}
        />
        <SummaryCard
          title="Total Orders"
          value={dashboardData.totalOrders.toLocaleString()}
          icon={<Store className="h-6 w-6 text-green-500" />}
        />
        <SummaryCard
          title="Total Posts"
          value={dashboardData.totalPosts.toLocaleString()}
          icon={<Radio className="h-6 w-6 text-red-500" />}
        />
        <SummaryCard
          title="Total Donation Received"
          value={`$${dashboardData.totalDonations.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
        />
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Pending Withdrawals"
          value="$12,500"
          icon={<DollarSign className="h-6 w-6 text-red-500" />}
        />
        <SummaryCard
          title="Revenue from Orders"
          value={`$${dashboardData.totalOrdersRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
        />
        <SummaryCard
          title="Revenue from Music"
          value={`$${dashboardData.totalMusicsRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
        />
        <SummaryCard
          title="Total Revenue"
          value={`$${dashboardData.totalRevenue.toLocaleString()}`}
          // change="+22%"
          icon={<DollarSign className="h-6 w-6 text-emerald-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Genre Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="h-64">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Headphones className="h-5 w-5 text-purple-500" />
              Music Genre Distribution
            </h2>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {genreData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"></div>

      {/* Recent Activity Section */}
      {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Recent Platform Activity
          </h2>
          <div className="space-y-4">
            <ActivityItem
              icon={<User className="h-4 w-4 text-blue-500" />}
              title="500 new users joined"
              time="2 hours ago"
            />
            <ActivityItem
              icon={<Music className="h-4 w-4 text-green-500" />}
              title="Ariana Grande uploaded new album"
              time="5 hours ago"
            />
            <ActivityItem
              icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
              title="Monthly revenue target achieved"
              time="1 day ago"
            />
            <ActivityItem
              icon={<Wallet className="h-4 w-4 text-amber-500" />}
              title="15 new withdrawal requests"
              time="2 days ago"
            />
          </div>
        </div>
      </div> */}

      {/* Export Section */}
      <div className="flex justify-center mt-6 bg-white p-2 rounded-md">
        <div className="text-2xl font-bold text-blue-950 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}
