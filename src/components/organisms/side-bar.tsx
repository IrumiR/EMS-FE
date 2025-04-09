import { Link, useLocation } from "react-router-dom";
import { UserRole } from "../types";
import {
  HiOutlineViewGrid,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineArchive,
  HiOutlineCurrencyDollar,
  HiOutlineChatAlt,
  HiOutlineUsers,
  HiOutlineCog,
} from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import Logo from "../../assets/svg/sidebar-logo.svg";
import { JSX } from "react";

type SidebarProps = {
  role: UserRole;
};

const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();

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
      {
        to: "/reports",
        label: "REPORTS",
        icon: <HiOutlineChatAlt size={20} />,
      },
      { to: "/team", label: "TEAM", icon: <HiOutlineUsers size={20} /> },
      { to: "/profile", label: "PROFILE", icon: <HiOutlineCog size={20} /> },
    ],
    manager: [
      { to: "/events", label: "EVENTS", icon: <HiOutlineCalendar size={20} /> },
      { to: "/profile", label: "PROFILE", icon: <FiUser size={20} /> },
    ],
    client: [
      {
        to: "/events",
        label: "MY EVENTS",
        icon: <HiOutlineCalendar size={20} />,
      },
    ],
    member: [{ to: "/profile", label: "PROFILE", icon: <FiUser size={20} /> }],
  };

  const linksToRender = [...commonLinks, ...(roleLinks[role] || [])];

  return (
    <div className="w-64 h-screen bg-white px-4 pt-6 shadow-md z-50">
      <div className="flex items-center gap-2 mb-10 px-4">
        <img src={Logo} alt="EvoMo Logo" className="w-6 h-6" />
        <h1 className="text-xl font-semibold">EvoMo</h1>
      </div>

      <nav className="flex flex-col gap-3">
        {linksToRender.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive(link.to)
                ? "bg-gray-100 text-green-600 font-semibold"
                : "text-gray-500 hover:text-green-600 hover:bg-gray-50 font-medium"
            }`}
          >
            {link.icon}
            <span className="text-sm uppercase">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
