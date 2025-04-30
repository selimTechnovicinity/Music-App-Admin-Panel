"use client";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { BsEnvelopeOpenHeart, BsPostcardFill } from "react-icons/bs";
import { CiTextAlignJustify } from "react-icons/ci";
import {
  FaClipboardList,
  FaHeadphonesAlt,
  FaMicrophoneAlt,
  FaPercent,
} from "react-icons/fa";
import { FaCircleDollarToSlot, FaClipboardQuestion } from "react-icons/fa6";
import { FiMenu, FiUser } from "react-icons/fi";
import { GiMusicalNotes } from "react-icons/gi";
import { GrTransaction } from "react-icons/gr";
import { IoSettings } from "react-icons/io5";
import {
  MdOutlineLanguage,
  MdOutlineLibraryMusic,
  MdPrivacyTip,
} from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { SiProducthunt } from "react-icons/si";
import {
  TbEdit,
  TbMusicCode,
  TbMusicDollar,
  TbMusicPlus,
  TbPasswordUser,
} from "react-icons/tb";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | undefined>();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setAccessToken(token);
  }, []);

  const isActive = (path: string) => pathname === path;

  // Handle logout
  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    toast.success("Logout Successful");
    router.push("/login");
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="p-2 m-2   text-white cursor-pointer rounded-full fixed z-40"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`flex flex-col bg-blue-950 text-white h-screen fixed z-25 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "210px" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          <button onClick={toggleSidebar} className="lg:hidden">
            <FiMenu size={24} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-grow mt-5 overflow-auto">
          <ul className="space-y-4 p-4">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/dashboard") ||
                  isActive("/dashboard/") ||
                  pathname.startsWith("/dashboard")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <BiSolidDashboard size={20} />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                href="/transactions"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/transactions") ||
                  isActive("/transactions/") ||
                  pathname.startsWith("/transactions")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <GrTransaction size={20} />
                <span>Transactions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/posts"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/posts") ||
                  isActive("/posts/") ||
                  pathname.startsWith("/posts")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <BsPostcardFill size={20} />
                <span>Posts</span>
              </Link>
            </li>
            <li>
              <Link
                href="/users"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/users") ||
                  isActive("/users/") ||
                  pathname.startsWith("/users")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <FiUser size={20} />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                href="/musicians"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/musicians") ||
                  isActive("/musicians/") ||
                  pathname.startsWith("/musicians")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <FaMicrophoneAlt size={20} />
                <span>Musicians</span>
              </Link>
            </li>

            <li>
              <Link
                href="/songs"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/songs") ||
                  isActive("/songs/") ||
                  pathname.startsWith("/songs")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <GiMusicalNotes size={20} />
                <span>Songs</span>
              </Link>
            </li>
            <li>
              <Link
                href="/music-albums"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/music-albums")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <MdOutlineLibraryMusic size={20} />
                <span>Music Albums</span>
              </Link>
            </li>
            <li>
              <Link
                href="/song-sell"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/song-sell") ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <TbMusicDollar size={20} />
                <span>song-sell</span>
              </Link>
            </li>
            <li>
              <Link
                href="/genre"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/genre") ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <TbMusicPlus size={20} />
                <span>Genre</span>
              </Link>
            </li>
            <li>
              <Link
                href="/song-format"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/song-format") ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <TbMusicCode size={20} />
                <span>Song Format</span>
              </Link>
            </li>
            <li>
              <Link
                href="/song-language"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/song-language")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <MdOutlineLanguage size={20} />
                <span>Song language</span>
              </Link>
            </li>
            <li>
              <Link
                href="/mood"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/mood") ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <FaHeadphonesAlt size={20} />
                <span>Mood</span>
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/products") ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <SiProducthunt size={20} />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/orders") ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <FaClipboardList size={20} />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                href="/product-sell"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/product-sell")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <FaCircleDollarToSlot size={20} />
                <span>Product Sell</span>
              </Link>
            </li>
            <li>
              <Link
                href="/statuses"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/statuses") ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <FaClipboardList size={20} />
                <span>Order Statuses</span>
              </Link>
            </li>
            <li>
              <Link
                href="/update-profile"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/update-profile")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <TbEdit size={20} />
                <span>Update Admin</span>
              </Link>
            </li>
            <li>
              <Link
                href="/update-password"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/update-password")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <TbPasswordUser size={20} />
                <span>Update Admin Password</span>
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/faq") ||
                  isActive("/faq/") ||
                  pathname.startsWith("/faq")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <FaClipboardQuestion size={20} />
                <span>FAQ</span>
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/privacy") ||
                  isActive("/privacy/") ||
                  pathname.startsWith("/privacy")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <MdPrivacyTip size={20} />
                <span>Privacy & Policy</span>
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/terms") ||
                  isActive("/terms/") ||
                  pathname.startsWith("/terms")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <CiTextAlignJustify size={20} />
                <span>Terms & Conditions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/messages"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/messages") ||
                  isActive("/messages/") ||
                  pathname.startsWith("/messages")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <BsEnvelopeOpenHeart size={20} />
                <span>Messages</span>
              </Link>
            </li>
            <li>
              <Link
                href="/set-commissions"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/set-commissions") ||
                  isActive("/set-commissions/") ||
                  pathname.startsWith("/set-commissions")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <FaPercent size={20} />
                <span>Commissions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/settings") ||
                  isActive("/settings/") ||
                  pathname.startsWith("/settings")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <IoSettings size={20} />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <>
                {accessToken ? (
                  <button
                    className="flex w-full items-center gap-3 p-2 rounded cursor-pointer hover:bg-blue-700"
                    onClick={handleLogout}
                  >
                    <RiLogoutBoxRLine />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link href="/login">
                    <button className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-blue-700">
                      Login
                    </button>
                  </Link>
                )}
              </>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
