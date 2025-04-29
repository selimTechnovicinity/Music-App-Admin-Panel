"use client";

import { Card, CardContent } from "@/ui/Card";
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


const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 6000 },
  { month: "May", revenue: 7500 },
  { month: "Jun", revenue: 9000 },
];

const genreData = [
  { name: "Pop", value: 35 },
  { name: "Hip Hop", value: 25 },
  { name: "Rock", value: 20 },
  { name: "Electronic", value: 15 },
  { name: "Other", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const withdrawalRequests = [
  {
    id: 1,
    artist: "Taylor Swift",
    amount: "$2,500",
    date: "2023-06-15",
    status: "Pending",
  },
  {
    id: 2,
    artist: "Drake",
    amount: "$1,800",
    date: "2023-06-14",
    status: "Approved",
  },
  {
    id: 3,
    artist: "Billie Eilish",
    amount: "$3,200",
    date: "2023-06-12",
    status: "Pending",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-100">
      {/* Top Summary Cards - Expanded */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Users"
          value="24,850"
          change="+12%"
          icon={<User className="h-6 w-6 text-blue-500" />}
        />
        <SummaryCard
          title="Total Artists"
          value="1,240"
          change="+5%"
          icon={<Mic2 className="h-6 w-6 text-blue-500" />}
        />
        <SummaryCard
          title="Songs Uploaded"
          value="32,450"
          change="+8%"
          icon={<Music className="h-6 w-6 text-blue-500" />}
        />
        <SummaryCard
          title="Total Music Albums"
          value="$12,500"
          icon={<Wallet className="h-6 w-6 text-blue-500" />}
        />
      </div>

      {/* Second Row Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Active Subscriptions"
          value="8,420"
          icon={<Radio className="h-6 w-6 text-red-500" />}
        />
        <SummaryCard
          title="Total Orders"
          value="8,420"
          icon={<Store className="h-6 w-6 text-green-500" />}
        />

        <SummaryCard
          title="New Releases"
          value="1,245"
          icon={<Music className="h-6 w-6 text-green-500" />}
        />
        <SummaryCard
          title="Total Donation Received"
          value="$12,500"
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
        />
      </div>
      {/* Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Pending Withdrawals"
          value="$12,500"
          icon={<DollarSign className="h-6 w-6 text-red-500" />}
        />

        <SummaryCard
          title="Total Payment Received for Orders"
          value="$12,500"
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
        />

        <SummaryCard
          title="Total Payment Received for Music"
          value="$12,500"
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
        />
        <SummaryCard
          title="Total Revenue"
          value="$48,750"
          change="+22%"
          icon={<DollarSign className="h-6 w-6 text-emerald-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Users Line Chart */}
        <Card className="p-4 col-span-1 lg:col-span-2">
          <CardContent className="h-64">
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
          </CardContent>
        </Card>

        {/* Genre Distribution Pie Chart */}
        <Card className="p-4">
          <CardContent className="h-64">
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
          </CardContent>
        </Card>
      </div>

      {/* Detailed Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal Requests */}
        <Card className="p-4">
          <CardContent>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-amber-500" /> Pending Withdrawals
            </h2>
            <div className="space-y-4">
              {withdrawalRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{request.artist}</p>
                    <p className="text-sm text-gray-500">{request.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{request.amount}</p>
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
              <button className="w-full mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Withdrawals →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Most Played Songs */}
        <Card className="p-4">
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Top Artists */}
        <Card className="p-4">
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card className="p-4">
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Export Section */}
      <div className="flex justify-between mt-6">
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition">
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

function SummaryCard({
  title,
  value,
  icon,
  change,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                change.startsWith("+") ? "text-green-500" : "text-red-500"
              }`}
            >
              {change} from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-opacity-20 bg-gray-300 rounded-full">{icon}</div>
      </div>
    </Card>
  );
}

function SongItem({
  rank,
  name,
  plays,
  change,
}: {
  rank: number;
  name: string;
  plays: string;
  change?: string;
}) {
  return (
    <li className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
      <div className="flex gap-3 items-center">
        <span
          className={`font-bold ${
            rank === 1
              ? "text-yellow-500"
              : rank === 2
              ? "text-gray-400"
              : rank === 3
              ? "text-amber-700"
              : "text-gray-300"
          }`}
        >
          {rank}
        </span>
        <span>{name}</span>
      </div>
      <div className="text-right">
        <p className="text-gray-600">{plays}</p>
        {change && (
          <p
            className={`text-xs ${
              change.startsWith("+") ? "text-green-500" : "text-red-500"
            }`}
          >
            {change}
          </p>
        )}
      </div>
    </li>
  );
}

function ArtistItem({
  name,
  songs,
  earnings,
}: {
  name: string;
  songs: string;
  earnings: string;
}) {
  return (
    <li className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-400">{songs} Songs</p>
      </div>
      <span className="font-semibold text-green-600">{earnings}</span>
    </li>
  );
}

function ActivityItem({
  icon,
  title,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
}
