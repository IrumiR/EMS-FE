import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Eye, FilePenLine, Repeat } from "lucide-react";
import { HiSearch } from "react-icons/hi";
import TableComponent from "@/components/molecules/table";
import { AddUserDialog } from "@/components/organisms/addUserDialog";
import { EditUserDialog } from "@/components/organisms/editUserDialog";
import { ViewUserDialog } from "@/components/organisms/viewUserDialog";
import { DeactivateUserDialog } from "@/components/organisms/deactivateUserDialog";
import { useGetAllUsers } from "@/api/authApi";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function TeamScreen() {
  const columns = [
    { key: "userName", label: "User Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "role", label: "Role" },
  ];

  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const userType = localStorage.getItem("role");

  const data = useGetAllUsers(
    currentPage,
    rowsPerPage,
    searchTerm,
    selectedRole !== "All Roles" ? selectedRole.toLowerCase() : undefined
  );

  const users = data?.data?.users || [];
  console.log("Users data", data.data?.users);
  const totalUsers = data.data?.pagination.total || 0;
  const totalPages = Math.ceil(totalUsers / rowsPerPage);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roleFromUrl = searchParams.get("role");
    if (roleFromUrl) {
      const normalizedRole = roleFromUrl.toLowerCase();
      const matchedRole = roles.find((r) => r.toLowerCase() === normalizedRole);
      if (matchedRole) {
        setSelectedRole(matchedRole);
      }
    }
  }, [searchParams]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); 
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
    if (role === "All Roles") {
      navigate("/team");
    } else {
      navigate(`/team?role=${encodeURIComponent(role.toLowerCase())}`);
    }
  };
  
  const formattedUsers = users.map((user) => ({
    ...user,
    role: Array.isArray(user.role) ? user.role.join(", ") : user.role,
  }));

  const roles = ["All Roles", "Admin", "Manager", "Team-Member", "Client"];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="mt-4 text-gray-600">Find and filter user roles here.</p>
        </div>

        <div>{userType === "admin" && <AddUserDialog />}</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="relative w-2/3 flex justify-start">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                {selectedRole}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {roles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleRoleChange(role)}
                >
                  {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <TableComponent
          columns={columns}
          data={formattedUsers}
          actions={(row) => (
            <div className="flex items-center space-x-2">
              <ViewUserDialog
                userId={row._id}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                }
              />
              {userType === "admin" && (
                <>
                  <EditUserDialog
                    userId={row._id}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-gray-100"
                      >
                        <FilePenLine className="h-4 w-4 text-green-600" />
                      </Button>
                    }
                  />
                  <DeactivateUserDialog
                    userId={row._id}
                    isActive={row.isActive}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-gray-100"
                        title={
                          row.isActive ? "Deactivate User" : "Activate User"
                        }
                      >
                        <Repeat
                          className={`h-4 w-4 ${
                            row.isActive ? "text-red-600" : "text-green-600"
                          }`}
                        />
                      </Button>
                    }
                  />
                </>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Users per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            {[5, 10, 15, 20, 25].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default TeamScreen;
