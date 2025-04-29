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
import { ChevronDown,  Eye, FilePenLine, CalendarCheck } from "lucide-react";
import { HiPlus, HiSearch } from "react-icons/hi";
import TableComponent from "@/components/molecules/table";
import AddItemDialog from "@/components/atoms/addItemDialog";
import { useInventoryItems } from "@/api/inventoryApi";

function InventoryScreen() {
  const columns = [
    { key: "name", label: "Item Name" },
    { key: "category", label: "Category" },
    { key: "condition", label: "Condition" },
    { key: "totalQuantity", label: "Total Quantity" },
    { key: "remainingQuantity", label: "Remaining Quantity" },
  ];


  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="mt-4 text-gray-600">
            Find and filter inventory items here.
          </p>
        </div>

        <div>
        <AddItemDialog
        />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="relative w-2/3 flex justify-start">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search inventory..." className="pl-10 w-full" />
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                All Statuses
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                All Categories
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <TableComponent
          columns={columns}
          // data={data}
          actions={(row) => (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                <Eye className="h-4 w-4 text-blue-600" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                <FilePenLine className="h-4 w-4 text-green-600" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                <CalendarCheck className="h-4 w-4 text-purple-600" />
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default InventoryScreen;
