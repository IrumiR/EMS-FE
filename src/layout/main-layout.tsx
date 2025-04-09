import { ReactNode } from "react";
import { UserRole } from "../components/types";
import Sidebar from "../components/organisms/side-bar";
import Topbar from "../components/organisms/top-bar";

type MainLayoutProps = {
  children: ReactNode;
  role: UserRole;
};

const MainLayout = ({ children, role }: MainLayoutProps) => {
  return (
    <div className="flex h-screen">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 bg-[#F7FFFD]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
