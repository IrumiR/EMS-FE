import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Download } from "lucide-react";
import ViewMore from "./viewMore";
import { useState } from "react";
import { EditBudgetDialog } from "../organisms/editBudgetDialog";
import { Budget } from "../types";
import { SingleBudgetReport } from "@/pages/budget/singleBudgetReport";

interface BudgetCardProps {
  budgets?: Budget[];
}

const BudgetCard = ({ budgets = [] }: BudgetCardProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>("");

  const userType = localStorage.getItem("role");

  // Function to get status from isApproved field - same logic as view dialog
  const getStatusFromBudget = (isApproved: boolean | null | undefined): string => {
    if (isApproved === null || isApproved === undefined) return "Pending";
    if (isApproved === true) return "Approved";
    if (isApproved === false) return "Rejected";
    return "Pending";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const selectedBudget = budgets.find(
    (b) => b._id.toString() === selectedBudgetId
  );

  const handleViewDialogClose = () => {
    setIsViewDialogOpen(false);
    // Clear selected budget after a short delay to prevent flashing
    setTimeout(() => {
      setSelectedBudgetId(null);
    }, 300);
  };

  const handleDownload = (budget: Budget) => {
    try {
      SingleBudgetReport(budget);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
 
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {budgets.map((budget) => {
        const budgetStatus = getStatusFromBudget(budget.isApproved);
        
        return (
          <Card
            key={budget._id}
            className="w-full bg-white shadow-sm border border-gray-200 rounded-lg relative"
          >
            <CardContent className="p-4 pt-2">
              {/* Status Header */}
              <div className="flex items-center justify-end mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    budgetStatus
                  )}`}
                >
                  {budgetStatus}
                </span>
              </div>

              {/* Event Name */}
              <h3 className="text-base font-semibold text-blue-600 mb-2 leading-tight">
                {budget.eventId.eventName}
              </h3>

              {/* Total Amount */}
              <div className="mb-4">
                <p className="text-lg font-bold text-gray-900">
                  Rs. {budget.totalAmount.toLocaleString()}
                  <span className="text-sm font-normal text-gray-900 ml-2">
                    Total Budget
                  </span>
                </p>
              </div>

              {/* Expenses */}
              <div className="space-y-2 mb-3">
                {budget.expenses.slice(0, 2).map((expense, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">{expense.expenseName}</span>
                    <span className="font-medium text-gray-900">
                      Rs. {expense.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedBudgetId(budget._id.toString());
                    setIsViewDialogOpen(true);
                  }}
                >
                  View More
                </Button>
              </div>
            </CardContent>

            <div className="absolute bottom-2 right-2 flex gap-1">
              {(budgetStatus === "Approved" || budgetStatus === "Rejected") && (
                <button
                  className="p-2 rounded-full hover:bg-green-100 transition-colors duration-200"
                  onClick={() => handleDownload(budget)}
                  title="Download Budget"
                >
                  <Download className="w-4 h-4 text-green-600" />
                </button>
              )}
              {(userType === "admin" || userType === "manager") && (
                <button
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => {
                    setSelectedBudgetId(budget._id.toString());
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
              )}
            </div>
          </Card>
        );
      })}

      {/* View More Dialog */}
      <ViewMore
        open={isViewDialogOpen}
        onOpenChange={handleViewDialogClose}
        budget={selectedBudget}
      />

      {/* Edit Dialog with selected budget */}
      {selectedBudgetId !== null && (
        <EditBudgetDialog
          budgetId={selectedBudgetId}
          open={isEditDialogOpen}
          onOpenChange={() => setIsEditDialogOpen(false)}
          budget={selectedBudget}
        />
      )}
    </div>
  );
};

export default BudgetCard;