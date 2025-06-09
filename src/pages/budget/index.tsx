import { AddBudgetDialog } from "@/components/organisms/addBudgetDialog";
import BudgetCard from "@/components/molecules/budgetCard";
import { useGetAllBudgets } from "@/api/budgetApi";
import { useState } from "react";
import { Loader2 } from "lucide-react";

function BudgetScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

// Define types for budget and eventId
type EventIdType = {
  eventName?: string;
  [key: string]: any;
};

type BudgetType = {
  _id: string | number;
  eventId?: EventIdType | string | null;
  isApproved: boolean;
  totalAmount: number;
  expenses?: { expenseName?: string; amount?: number }[];
};

// Fetch budgets using the API hook
const { data, isLoading, error } = useGetAllBudgets(
  currentPage,
  rowsPerPage,
  searchTerm
);

const totalBudgets = data?.pagination?.total || 0;
const totalPages = Math.ceil(totalBudgets / rowsPerPage);

const budgets = (data?.budgets as BudgetType[] || []).map((budget) => ({
  id: Number(budget._id),
  eventName:
    typeof budget.eventId === "object" && budget.eventId && "eventName" in budget.eventId && budget.eventId.eventName
      ? budget.eventId.eventName
      : "Unknown Event",
  isApproved: budget.isApproved,
  totalAmount: budget.totalAmount,
  expenses: (budget.expenses || []).map((expense) => ({
    name: expense.expenseName || "Unnamed Expense",
    amount: expense.amount || 0,
  })),
}));


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
          <AddBudgetDialog />
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
