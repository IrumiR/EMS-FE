import { Link, useLocation } from "react-router-dom";
import { UserRole } from "../types";
import {
  HiOutlineViewGrid,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineArchive,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
  HiOutlineCog,
  HiChevronLeft,
} from "react-icons/hi";
import { FileSliders } from "lucide-react";
import { FiUser } from "react-icons/fi";
import Logo from "../../assets/svg/sidebar-logo.svg";
import { JSX, useState, useEffect } from "react";
import { CalendarClock } from "lucide-react";

type SidebarProps = {
  role: UserRole;
};

const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();
  const userRole = (localStorage.getItem("role") as UserRole) || "team-member";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size and set mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      // Auto-collapse on mobile
      if (mobile && !isCollapsed) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isCollapsed]);

  const toggleSidebar = () => {
    // Only allow toggle on desktop
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogoClick = () => {
    // Allow logo click to expand sidebar when collapsed (desktop only)
    if (!isMobile && isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const commonLinks = [
    {
      to: "/dashboard",
      label: "DASHBOARD",
      icon: <HiOutlineViewGrid size={20} />,
    },
  ];

  const roleLinks: Record<
    UserRole,
    { to: string; label: string; icon: JSX.Element }[]
  > = {
    admin: [
      { to: "/events", label: "EVENTS", icon: <HiOutlineCalendar size={20} /> },
      {
        to: "/tasks",
        label: "TASKS",
        icon: <HiOutlineClipboardList size={20} />,
      },
      {
        to: "/inventory",
        label: "INVENTORY",
        icon: <HiOutlineArchive size={20} />,
      },
      {
        to: "/budget",
        label: "BUDGET",
        icon: <HiOutlineCurrencyDollar size={20} />,
      },
      { to: "/calendar", label: "CALENDAR", icon: <CalendarClock size={20} /> },
      { to: "/reports", label: "REPORTS", icon: <FileSliders size={20} /> },
      { to: "/team", label: "TEAM", icon: <HiOutlineUsers size={20} /> },
    ],
    manager: [
      { to: "/events", label: "EVENTS", icon: <HiOutlineCalendar size={20} /> },
      {
        to: "/tasks",
        label: "TASKS",
        icon: <HiOutlineClipboardList size={20} />,
      },
      {
        to: "/inventory",
        label: "INVENTORY",
        icon: <HiOutlineArchive size={20} />,
      },
      { to: "/calendar", label: "CALENDAR", icon: <CalendarClock size={20} /> },
    ],
    client: [
      {
        to: "/events",
        label: "MY EVENTS",
        icon: <HiOutlineCalendar size={20} />,
      },
      {
        to: "/budget",
        label: "BUDGET",
        icon: <HiOutlineCurrencyDollar size={20} />,
      },
      { to: "/calendar", label: "CALENDAR", icon: <CalendarClock size={20} /> },
    ],
    "team-member": [
      {
        to: "/events",
        label: "EVENTS",
        icon: <HiOutlineCalendar size={20} />,
      },
      {
        to: "/tasks",
        label: "MY TASKS",
        icon: <HiOutlineClipboardList size={20} />,
      },
      {
        to: "/inventory",
        label: "INVENTORY",
        icon: <HiOutlineArchive size={20} />,
      },
      { to: "/calendar", label: "CALENDAR", icon: <CalendarClock size={20} /> },
    ],
  };

  const linksToRender = [...commonLinks, ...(roleLinks[userRole] || [])];

  return (
    <div
      className={`
        ${isCollapsed || isMobile ? "w-16" : "w-64"}
        h-full bg-white px-2 pt-6 shadow-md z-50
        transition-all duration-300 ease-in-out
        relative
        ${isMobile ? "fixed left-0 top-0 h-screen" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-2">
          <img
            src={Logo}
            alt="EvoMo Logo"
            className={`w-6 h-6 ${!isMobile ? "cursor-pointer" : ""}`}
            onClick={handleLogoClick}
          />
          {!isCollapsed && !isMobile && (
            <h1 className="text-xl font-semibold">EvoMo</h1>
          )}
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {linksToRender.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`
              flex items-center justify-center
              ${
                isCollapsed || isMobile
                  ? "px-3 py-4"
                  : "px-3 py-3 gap-3 justify-start"
              } 
              rounded-lg transition-colors duration-200 group relative
              ${
                isActive(link.to)
                  ? "bg-gray-100 text-green-600 font-semibold"
                  : "text-gray-500 hover:text-green-600 hover:bg-gray-50 font-medium"
              }
            `}
            title={isCollapsed || isMobile ? link.label : undefined}
          >
            <div className="flex items-center justify-center">{link.icon}</div>
            {!isCollapsed && !isMobile && (
              <span className="text-sm uppercase truncate">{link.label}</span>
            )}

            {/* Tooltip for collapsed state */}
            {(isCollapsed || isMobile) && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {link.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Toggle button - only show on desktop and when expanded */}
      {!isMobile && !isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="absolute top-6 right-[0px] bg-white border rounded-full shadow p-1 hover:bg-gray-50 transition-colors duration-200"
        >
          <HiChevronLeft size={20} />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
