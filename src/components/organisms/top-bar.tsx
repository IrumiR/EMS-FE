import { useLocation, Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FaRegBell } from "react-icons/fa";
import { HiLogout } from "react-icons/hi";
import { useEffect, useState } from "react";
import NotificationList from "./notificationList";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
  useGetNotification,
  useUpdateNotification,
} from "@/api/notificationApi"; 

const Topbar = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const navigate = useNavigate();
  const profileImage = localStorage.getItem("profileImage") || "";
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({ userName: "", role: "" });

  useEffect(() => {
    const userName = localStorage.getItem("userName") || "User";
    const role = localStorage.getItem("role") || "Guest";
    setUserInfo({ userName, role });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const { data, isLoading, isError } = useGetNotification();
  const unreadCount = data?.unreadCount || 0;
  const notifications = data?.notifications || [];

  const updateNotification = useUpdateNotification(
    (message) => {
      console.log("✅ Notifications updated:", message);
    },
    (message) => {
      console.error("❌ Notification update failed:", message);
    }
  );

  useEffect(() => {
    if (isNotifOpen && notifications.length > 0) {
      const userId = localStorage.getItem("userId")

      const unreadIds = notifications
        .filter((n: { readBy?: string[]; _id: string }) => !n.readBy?.includes(userId || ""))
        .map((n: { _id: string }) => n._id);

      if (userId && unreadIds.length > 0) {
        updateNotification.mutate({ userId, notificationIds: unreadIds });
      }
    }
  }, [isNotifOpen]);

  return (
    <header className="h-20 bg-white shadow-xs px-6 flex items-center justify-between z-50">
      <nav className="flex items-center text-sm text-gray-600 space-x-1">
        {pathSegments.map((segment, index) => {
          const fullPath = pathSegments.slice(0, index + 1).join("/");
          const label = segment.replace(" ", "").toLocaleLowerCase();
          return (
            <div key={index} className="flex items-center space-x-1">
              <Link
                to={fullPath}
                className="hover:text-green-600 capitalize font-semibold text-base"
              >
                {label}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="text-sm text-gray-700 gap-4 flex items-center">
        {/* ✅ Controlled popover with open tracking */}
        <Popover open={isNotifOpen} onOpenChange={setIsNotifOpen}>
          <PopoverTrigger className="relative w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition duration-200 hover:cursor-pointer">
            <FaRegBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {unreadCount}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent>
            <NotificationList
              isLoading={isLoading}
              isError={isError}
              notifications={notifications}
            />
          </PopoverContent>
        </Popover>

        <div className="flex flex-col items-end text-right">
          <span className="font-semibold text-gray-800 text-sm">
            {userInfo.userName}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {userInfo.role}
          </span>
        </div>

        <Popover>
          <PopoverTrigger className="w-10 h-10 hover:cursor-pointer">
            <img
              src={`/profile-avatar/${profileImage || "01"}.png`}
              alt="Selected Profile"
              className="rounded-full border-2 border-teal-500 shadow bg-teal-200"
            />
          </PopoverTrigger>
          <PopoverContent className="w-32 flex flex-col gap-2 p-0 mr-6">
            <Button
              onClick={handleLogout}
              className="flex items-center gap-6 bg-white text-black hover:bg-teal-50 shadow-none"
            >
              <HiLogout className="w-5 h-5 text-black" />
              <span>Logout</span>
            </Button>
            <Button
              onClick={handleProfile}
              className="flex items-center gap-6 bg-white text-black hover:bg-teal-50"
            >
              <Settings className="w-5 h-5 text-black" />
              <span>Profile</span>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Topbar;
