import { AddBudgetDialog } from "@/components/organisms/addBudgetDialog";
import BudgetCard from "@/components/molecules/budgetCard";
import { useGetAllBudgets } from "@/api/budgetApi";
import { useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Budget } from "@/components/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

function BudgetScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [budgetType, setBudgetType] = useState<
    "Pending" | "Approved" | "Rejected" | undefined
  >(undefined);

  //Remove above search term & budget type use states & apply below
  // const [selectedStatus, setSelectedStatus] = useState<
  //   "All" | "Pending" | "Approved" | "Rejected"
  // >("All");

  // const budgetType = selectedStatus === "All" ? undefined : selectedStatus;

  const role = localStorage.getItem("role") || "";

  // Fetch budgets using the API hook
  const { data, isLoading, error } = useGetAllBudgets(
    currentPage,
    rowsPerPage,
    searchTerm,
    //remove search term & apply below undefined
    // undefined,
    // undefined,
    budgetType,
  );

  const totalBudgets = data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalBudgets / rowsPerPage);

  const budgets: Budget[] = (data?.budgets || []).map((budget: any) => ({
    ...budget,
    eventId:
      typeof budget.eventId === "string"
        ? { _id: budget.eventId, eventName: "" }
        : budget.eventId,
  }));

  //  const handleStatusChange = (status: string) => {
  //    setSelectedStatus(status as "All" | "Pending" | "Approved" | "Rejected");

  //    if (status === "All") {
  //      setSearchParams({});
  //    } else {
  //      setSearchParams({ status });
  //    }

  //    setCurrentPage(1);
  //  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (
      statusParam === "Pending" ||
      statusParam === "Approved" ||
      statusParam === "Rejected"
    ) {
      setBudgetType(statusParam);
    }
  }, [searchParams]);

  //Remove above search params & use effect, then apply below
  // const [searchParams, setSearchParams] = useSearchParams();

  // useEffect(() => {
  //   const statusParam = searchParams.get("status");
  //   if (
  //     statusParam === "Pending" ||
  //     statusParam === "Approved" ||
  //     statusParam === "Rejected"
  //   ) {
  //     setSelectedStatus(statusParam);
  //   } else {
  //     setSelectedStatus("All");
  //   }
  // }, [searchParams]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading budgets. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budget</h1>
          <p className="mt-4 text-gray-600">
            Manage and track your expenses here.
          </p>
        </div>

        <div>
          {(role === "admin" || role === "manager") && <AddBudgetDialog />}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end space-x-2">
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                {budgetType ?? "All Budgets"}
                {/* {selectedStatus === "All" ? "All Budgets" : selectedStatus} */}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setBudgetType(undefined)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBudgetType("Pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBudgetType("Approved")}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBudgetType("Rejected")}>
                Rejected
              </DropdownMenuItem>

              {/* Apply below removing above dropdown items */}
              {/* {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))} */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-36">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-500 text-lg mt-4">Loading budgets...</p>
          </div>
        ) : budgets.length > 0 ? (
          <div>
            <BudgetCard budgets={budgets} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-36">
            <p className="text-gray-500 text-lg">No budgets found.</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Next
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Budgets per page:</span>
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
    </div>
  );
}

export default BudgetScreen;