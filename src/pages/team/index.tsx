import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown,  Eye, FilePenLine } from "lucide-react";
import {  HiSearch } from "react-icons/hi";
import TableComponent from "@/components/molecules/table";
import { AddUserDialog } from "@/components/organisms/addUserDialog";
import { EditUserDialog } from "@/components/organisms/editUserDialog";
import { ViewUserDialog } from "@/components/organisms/viewUserDialog";
import { useGetAllUsers } from "@/api/authApi";
import { useMemo, useState } from "react";

function TeamScreen() {
  const columns = [
    { key: "userName", label: "User Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "role", label: "Role" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");

  const data = useGetAllUsers();

  const users = data?.data?.users || [];
  console.log("Users data", data.data?.users);
  const formattedUsers = users.map(user => ({
    ...user,
    role: Array.isArray(user.role) ? user.role.join(", ") : user.role,
  }));

  const filteredUsers = useMemo(() => {
    return formattedUsers.filter(user => {
      // Search filter (case insensitive)
      const matchesSearch = searchQuery === "" || 
        Object.values(user).some(value => 
          value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      // Role filter
      const matchesRole = selectedRole === "All Roles" || 
        (user.role && user.role.toLowerCase().includes(selectedRole.toLowerCase()));
      
      return matchesSearch && matchesRole;
    });
  }, [formattedUsers, searchQuery, selectedRole]);

  const roles = ["All Roles", "Admin", "Manager", "Team Member", "Client"];

  

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="mt-4 text-gray-600">
            Find and filter user roles here.
          </p>
        </div>

        <div>
        <AddUserDialog
        />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="relative w-2/3 flex justify-start">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search users..." className="pl-10 w-full" 
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}/>
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
              {roles.map(role => (
                <DropdownMenuItem 
                  key={role} 
                  onClick={() => setSelectedRole(role)}
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
          data={filteredUsers}
          actions={(row) => (
            <div className="flex items-center space-x-2">
             <ViewUserDialog 
                userId={row._id} 
                trigger={
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                }
              />
              <EditUserDialog 
                userId={row._id} 
                trigger={
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                    <FilePenLine className="h-4 w-4 text-green-600" />
                  </Button>
                }
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default TeamScreen;
