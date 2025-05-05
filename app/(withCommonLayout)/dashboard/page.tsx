"use client";

import API from "@/lib/axios-client";
import {
  DollarSign,
  Download,
  Headphones,
  Mic2,
  Music,
  Radio,
  Store,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


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

// Song Item Component
const SongItem = ({
  rank,
  name,
  plays,
  change,
}: {
  rank: number;
  name: string;
  plays: string;
  change: string;
}) => (
  <li className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
    <div className="flex items-center">
      <span className="font-medium text-gray-500 w-6">{rank}.</span>
      <span className="font-medium text-gray-800 dark:text-white">{name}</span>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium">{plays}</p>
      <p
        className={`text-xs ${
          change.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </p>
    </div>
  </li>
);

// Artist Item Component
const ArtistItem = ({
  name,
  earnings,
  songs,
}: {
  name: string;
  earnings: string;
  songs: string;
}) => (
  <li className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
    <span className="font-medium text-gray-800 dark:text-white">{name}</span>
    <div className="text-right">
      <p className="text-sm font-medium">{earnings}</p>
      <p className="text-xs text-gray-500">{songs} songs</p>
    </div>
  </li>
);

// Activity Item Component
const ActivityItem = ({
  icon,
  title,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  time: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 flex-shrink-0">{icon}</div>
    <div>
      <p className="font-medium text-gray-800 dark:text-white">{title}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  </div>
);

// Sample data for charts (you can replace with real data)
const revenueData = [
  { month: "Jan", revenue: 4000, users: 2400 },
  { month: "Feb", revenue: 3000, users: 1398 },
  { month: "Mar", revenue: 2000, users: 9800 },
  { month: "Apr", revenue: 2780, users: 3908 },
  { month: "May", revenue: 1890, users: 4800 },
  { month: "Jun", revenue: 2390, users: 3800 },
];

const genreData = [
  { name: "Pop", value: 35 },
  { name: "Rock", value: 25 },
  { name: "Hip Hop", value: 20 },
  { name: "Electronic", value: 15 },
  { name: "R&B", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const withdrawalRequests = [
  {
    id: 1,
    artist: "John Doe",
    amount: "$1,250",
    date: "Today",
    status: "Pending",
  },
  {
    id: 2,
    artist: "Jane Smith",
    amount: "$850",
    date: "Yesterday",
    status: "Approved",
  },
  {
    id: 3,
    artist: "Mike Johnson",
    amount: "$2,100",
    date: "2 days ago",
    status: "Pending",
  },
];

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

  useEffect(() => {
    fetchDashboardData();
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
          change="+12%"
          icon={<User className="h-6 w-6 text-blue-500" />}
        />
        <SummaryCard
          title="Total Artists"
          value={dashboardData.totalMusicians.toLocaleString()}
          change="+5%"
          icon={<Mic2 className="h-6 w-6 text-blue-500" />}
        />
        <SummaryCard
          title="Songs Uploaded"
          value={dashboardData.totalSongs.toLocaleString()}
          change="+8%"
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
          change="+22%"
          icon={<DollarSign className="h-6 w-6 text-emerald-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Users Line Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1 lg:col-span-2">
          <div className="h-64">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-500" /> Platform Growth
              (Last 6 Months)
            </h2>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="h-64">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Headphones className="h-5 w-5 text-purple-500" /> Music Genre
              Distribution
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-amber-500" /> Pending Withdrawals
            </h2>
            <div className="space-y-4">
              {withdrawalRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium dark:text-white">
                      {request.artist}
                    </p>
                    <p className="text-sm text-gray-500">{request.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold dark:text-white">
                      {request.amount}
                    </p>
                    <p
                      className={`text-sm ${
                        request.status === "Approved"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {request.status}
                    </p>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                View All Withdrawals →
              </button>
            </div>
          </div>
        </div>

        {/* Most Played Songs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Music className="h-5 w-5 text-green-500" /> Top Trending Songs
            </h2>
            <ul className="space-y-3">
              <SongItem
                rank={1}
                name="Blinding Lights"
                plays="5.3M"
                change="+12%"
              />
              <SongItem rank={2} name="Levitating" plays="4.9M" change="+8%" />
              <SongItem rank={3} name="Stay" plays="4.2M" change="+15%" />
              <SongItem rank={4} name="As It Was" plays="3.8M" change="+22%" />
              <SongItem rank={5} name="Bad Habits" plays="3.5M" change="+5%" />
            </ul>
          </div>
        </div>

        {/* Top Artists */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mic2 className="h-5 w-5 text-purple-500" /> Top Earning Artists
            </h2>
            <ul className="space-y-3">
              <ArtistItem name="Ed Sheeran" earnings="$125,000" songs="120" />
              <ArtistItem name="The Weeknd" earnings="$98,500" songs="98" />
              <ArtistItem name="Dua Lipa" earnings="$87,200" songs="80" />
              <ArtistItem name="Taylor Swift" earnings="$76,800" songs="150" />
              <ArtistItem name="BTS" earnings="$65,300" songs="95" />
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
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
      </div>

      {/* Export Section */}
      <div className="flex justify-between mt-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            <Download className="h-5 w-5" />
            Download CSV
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            <Download className="h-5 w-5" />
            Full Report PDF
          </button>
        </div>
      </div>
    </div>
  );
}
