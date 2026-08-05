import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { HiSearch } from "react-icons/hi";
import TableComponent from "@/components/molecules/table";
import { Badge } from "@/components/ui/badge";
import {
  useGetReservationList,
  ReservationListItem,
} from "../../api/inventoryApi";

function ReservationScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemType, setSelectedItemType] = useState<
    "All" | "Internal" | "External"
  >("All");
  const [selectedReserveType, setSelectedReserveType] = useState<
    "All" | "Single Use" | "Rental"
  >("All");
  const [dateRange, setDateRange] = useState<
    "pastDay" | "pastWeek" | "pastMonth" | undefined
  >(undefined);

  const { data, isLoading, error } = useGetReservationList({
    page: currentPage,
    limit: rowsPerPage,
    event: searchTerm || undefined,
    reserveType:
      selectedReserveType === "All"
        ? "all"
        : selectedReserveType === "Single Use"
          ? "single-use"
          : "rental",
    itemType:
      selectedItemType === "All"
        ? "all"
        : selectedItemType === "Internal"
          ? "internal"
          : "external",
    dateRange,
  });

  const reservations = data?.reservations || [];
  const totalPages = data?.pagination?.totalPages || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedItemType,
    selectedReserveType,
    dateRange,
    rowsPerPage,
  ]);

  const columns = [
    { key: "itemName", label: "Item" },
    { key: "eventName", label: "Event" },
    { key: "date", label: "Date" },
    { key: "reservedQuantity", label: "Quantity" },
    { key: "itemType", label: "Item Type" },
    { key: "reserveType", label: "Reserve Type" },
    { key: "createdAt", label: "Created At" },
  ];

  const formattedReservations = reservations.map(
    (reservation: ReservationListItem) => ({
      ...reservation,
      eventName: reservation.event?.name ?? "-",
      date: reservation.date
        ? new Date(reservation.date).toLocaleDateString()
        : "-",
      createdAt: reservation.createdAt
        ? new Date(reservation.createdAt).toLocaleString()
        : "-",
      itemType: (
        <Badge
          variant={
            reservation.itemType === "external" ? "destructive" : "default"
          }
          className={
            reservation.itemType === "external"
              ? "bg-red-100 text-red-800 hover:bg-red-200"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          }
        >
          {reservation.itemType === "external" ? "External" : "Internal"}
        </Badge>
      ),
      reserveType: (
        <Badge
          variant={
            reservation.reserveType === "single-use" ? "destructive" : "default"
          }
          className={
            reservation.reserveType === "single-use"
              ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }
        >
          {reservation.reserveType === "single-use" ? "Single Use" : "Rental"}
        </Badge>
      ),
    }),
  );

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-2xl font-bold">Reservations</h1>
          <p className="text-gray-600">Manage and filter reservation list.</p>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative flex-1 min-w-[280px] xl:min-w-[320px]">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by event name or event id..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:flex-nowrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[120px] justify-between"
                >
                  {selectedItemType}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuItem onClick={() => setSelectedItemType("All")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedItemType("Internal")}
                >
                  Internal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedItemType("External")}
                >
                  External
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[120px] justify-between"
                >
                  {selectedReserveType}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuItem onClick={() => setSelectedReserveType("All")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedReserveType("Single Use")}
                >
                  Single Use
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedReserveType("Rental")}
                >
                  Rental
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[140px] justify-between"
                >
                  <span className="truncate">
                    {dateRange
                      ? dateRange.replace("past", "Past ")
                      : "Date Range"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuItem onClick={() => setDateRange(undefined)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("pastDay")}>
                  Past Day
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("pastWeek")}>
                  Past Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("pastMonth")}>
                  Past Month
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isLoading && <p>Loading reservations...</p>}
      {Boolean(error) && (
        <div className="text-red-500 mb-4">Error loading reservations</div>
      )}
      <div className="w-full overflow-x-auto">
        {formattedReservations.length > 0 ? (
          <TableComponent columns={columns} data={formattedReservations} />
        ) : (
          <div className="text-gray-600 py-8 text-center">
            No reservations found
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700">Items per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
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

export default ReservationScreen;
