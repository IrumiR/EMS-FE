import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import ViewMore from "./viewMore";
import { useState } from "react";
import { EditBudgetDialog } from "../organisms/editBudgetDialog";

interface Expense {
  name: string;
  amount: number;
}

interface Budget {
  id: number;
  eventName: string;
  isApproved: boolean;
  totalAmount: number;
  expenses: Expense[];
}

interface BudgetCardProps {
  budgets?: Budget[];
}

const BudgetCard = ({ budgets = [] }: BudgetCardProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {budgets.map((budget) => (
        <Card
          key={budget.id}
          className="w-full bg-white shadow-sm border border-gray-200 rounded-lg relative"
        >
          <CardContent className="p-4 pt-2">
            {/* Status Header */}
            <div className="flex items-center justify-end mb-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  budget.isApproved ? "Approved" : "Pending"
                )}`}
              >
                {budget.isApproved ? "Approved" : "Pending"}
              </span>
            </div>

            {/* Event Name */}
            <h3 className="text-base font-semibold text-blue-600 mb-2 leading-tight">
              {budget.eventName}
            </h3>

            {/* Total Amount and Total Budget on same line */}
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
                  <span className="text-gray-600">{expense.name}</span>
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
                onClick={() => setIsViewDialogOpen(true)}
              >
                View More
              </Button>
            </div>
          </CardContent>

          <div>
            <ViewMore
              open={isViewDialogOpen}
              onOpenChange={() => setIsViewDialogOpen(false)}
            />
          </div>

          <button className="absolute bottom-2 right-2 p-2 rounded-full hover:bg-blue-100 transition-colors duration-200">
            <Edit
              className="w-4 h-4 text-blue-600"
              onClick={() => setIsEditDialogOpen(true)}
            />
          </button>
        </Card>
      ))}

      <EditBudgetDialog
        open={isEditDialogOpen}
        onOpenChange={() => setIsEditDialogOpen(false)}
        budget={budgets} 
      />
    </div>
  );
};

export default BudgetCard;
