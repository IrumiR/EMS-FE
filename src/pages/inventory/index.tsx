import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Eye, FilePenLine, CalendarCheck } from "lucide-react";
import { HiSearch } from "react-icons/hi";
import TableComponent from "@/components/molecules/table";
import AddItemDialog from "@/components/organisms/addItemDialog";
import { useGetAllInventory } from "@/api/inventoryApi";
import { useState } from "react";
import { ViewItemDialog } from "@/components/organisms/viewItemDialog";
import { EditItemDialog } from "@/components/organisms/editItemDialog";

function InventoryScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const columns = [
    { key: "itemName", label: "Item Name" },
    { key: "category", label: "Category" },
    { key: "condition", label: "Condition" },
    { key: "totalQuantity", label: "Total Quantity" },
    { key: "remainingQuantity", label: "Remaining Quantity" },
  ];

  const { data, isLoading } = useGetAllInventory(
    currentPage,
    rowsPerPage,
    searchTerm
  );

  const inventoryItems = data?.inventoryItems || [];
  const totalPages = data?.pagination?.totalPages || 1;

  console.log("Inventory data", data?.inventoryItems);

  const formattedItems = inventoryItems.map((item) => ({
    ...item,
    // Format arrays to display as comma-separated strings
    category: Array.isArray(item.category)
      ? item.category.join(", ")
      : item.category,
    condition: Array.isArray(item.condition)
      ? item.condition.join(", ")
      : item.condition,
  }));

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
          <AddItemDialog />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="relative w-2/3 flex justify-start">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search inventory..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                {selectedStatus}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleStatusChange("All Statuses")}
              >
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("Available")}>
                Available
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("Out of Stock")}
              >
                Out of Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("Reserved")}>
                Reserved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("Damaged")}>
                Damaged
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                {selectedCategory}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleCategoryChange("All Categories")}
              >
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCategoryChange("Equipment")}
              >
                Equipment
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCategoryChange("Furniture")}
              >
                Furniture
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCategoryChange("Electronics")}
              >
                Electronics
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCategoryChange("Decorations")}
              >
                Decorations
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCategoryChange("Catering")}
              >
                Catering
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p>Loading inventory...</p>
        ) : (
          <TableComponent
            columns={columns}
            data={formattedItems}
            actions={(row) => (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedItem(row._id);
                    setViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedItem(row._id);
                    setEditDialogOpen(true);
                  }}
                >
                  <FilePenLine className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-gray-100"
                >
                  <CalendarCheck className="h-4 w-4 text-purple-600" />
                </Button>
              </div>
            )}
          />
        )}
      </div>

      <div>
        <ViewItemDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          itemId={selectedItem}
        />
      </div>

      <div>
        <EditItemDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          itemId={selectedItem}
        />
      </div>

      {/* Single Pagination Controls */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Items per page:</span>
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

export default InventoryScreen;
