import { useLocation, Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FaRegBell } from "react-icons/fa";
import UserLogo from "../../assets/svg/user-icon.svg";

const Topbar = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

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

      <div className="text-sm text-gray-700 gap-4 flex">
        <Popover>
          <PopoverTrigger className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition duration-200 hover:cursor-pointer">
            <FaRegBell className="w-5 h-5" />
          </PopoverTrigger>
          <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className="w-10 h-10 hover:cursor-pointer">
            <img
              src={UserLogo}
              alt="User Logo"
              className="w-full h-full rounded-full"
            />
          </PopoverTrigger>
          <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Topbar;
