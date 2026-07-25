import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Budget } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApproveBudget } from "@/api/budgetApi";
import toast from "react-hot-toast";

interface BudgetViewDialogProps {
  open: boolean;
  onOpenChange: () => void;
  budget?: Budget;
  budgetData?: {
    eventName: string;
    clientName: string;
    status: string;
    expenses: Array<{ name: string; value: number }>;
    inventoryItems: Array<{
      itemName: string;
      remainingQuantity: number;
      price: number;
    }>;
    totalAmount: number;
    discount: number;
    finalAmount: number;
    remarks: string;
    createdBy: string;
  };
}

export default function BudgetViewDialog({
  open,
  onOpenChange,
  budget,
}: BudgetViewDialogProps) {
  const [showRemarksField, setShowRemarksField] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );

  const userType = localStorage.getItem("role");

  // Initialize the mutation hook
  const budgetMutation = useApproveBudget(
    budget?._id || "",
    (message: string) => {
      toast.success(message);
      resetForm();
      onOpenChange();
    },
    (message: string) => {
      toast.error(message);
    },
  );

  // Function to get status from isApproved field
  const getStatusFromBudget = (isApproved: boolean | null): string => {
    if (isApproved === null) return "Pending";
    if (isApproved === true) return "Approved";
    if (isApproved === false) return "Rejected";
    return "Pending";
  };

  // Function to get remarks based on status
  const getRemarksFromBudget = (
    isApproved: boolean | null,
    remarks: string,
  ): string => {
    if (isApproved === true) return remarks || "No remarks";
    if (isApproved === false && remarks) return remarks;
    if (isApproved === false && !remarks) return "No rejection reason provided";
    return remarks || "No remarks";
  };

  const handleReject = () => {
    if (!showRemarksField) {
      setActionType("reject");
      setShowRemarksField(true);
    } else {
      // Validate remarks
      if (!remarks.trim()) {
        toast.error("Please provide remarks for rejection");
        return;
      }

      // Call API to reject budget
      budgetMutation.mutate({
        isApproved: false,
        remarks: remarks.trim(),
      });
    }
  };

  const handleApprove = () => {
    if (!showRemarksField) {
      setActionType("approve");
      setShowRemarksField(true);
    } else {
      // Validate remarks
      if (!remarks.trim()) {
        toast.error("Please provide remarks for approval");
        return;
      }

      // Call API to approve budget
      budgetMutation.mutate({
        isApproved: true,
        remarks: remarks.trim(),
      });
    }
  };

  const handleCancel = () => {
    if (budgetMutation.isLoading) {
      return; // Prevent canceling during API call
    }
    resetForm();
    onOpenChange();
  };

  const resetForm = () => {
    setShowRemarksField(false);
    setRemarks("");
    setActionType(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const currentStatus = getStatusFromBudget(budget?.isApproved ?? null);
  const currentRemarks = getRemarksFromBudget(
    budget?.isApproved ?? null,
    budget?.remarks || "",
  );

  const showActionButtons = budget?.isApproved === null;

  const calculateFinalAmount = (totalAmount?: number, discount?: number) => {
    if (typeof totalAmount !== "number") return 0;
    const discountPercent = discount || 0;
    const discountAmount = (totalAmount * discountPercent) / 100;
    return Math.max(0, totalAmount - discountAmount);
  };

  const displayFinalAmount =
    typeof budget?.finalAmount === "number"
      ? budget.finalAmount
      : calculateFinalAmount(budget?.totalAmount, budget?.discount);

  const getRemarksFieldStyle = () => {
    if (actionType === "approve") {
      return {
        containerClass: "p-3 bg-green-50 rounded-lg border border-green-200",
        labelClass: "text-sm font-medium text-green-700",
        textareaClass: "border-green-300 focus:border-green-500",
      };
    } else {
      return {
        containerClass: "p-3 bg-red-50 rounded-lg border border-red-200",
        labelClass: "text-sm font-medium text-red-700",
        textareaClass: "border-red-300 focus:border-red-500",
      };
    }
  };

  const remarksFieldStyle = getRemarksFieldStyle();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[100vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-left">
            View Budget
          </DialogTitle>
          <p className="text-sm text-gray-600 text-left">
            Viewing budget information for event:{" "}
            {budget?.eventId.eventName || "N/A"}
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="grid gap-4 py-4">
            {/* Event Name */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Event Name:
              </Label>
              <p className="text-sm text-gray-900">
                {budget?.eventId.eventName || "N/A"}
              </p>
            </div>

            {/* Client Name */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Client Name:
              </Label>
              <p className="text-sm text-gray-900">
                {budget?.clientId.userName || "N/A"}
              </p>
            </div>

            {/* Status */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Status:
              </Label>
              <p
                className={`text-sm font-medium ${getStatusColor(
                  currentStatus,
                )}`}
              >
                {currentStatus}
              </p>
            </div>

            {/* Expenses */}
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Expenses:
              </Label>
              <div className="space-y-2">
                {budget?.expenses?.map((expense, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-700">
                      • {expense.expenseName}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      Rs. {expense.amount.toLocaleString()}
                    </span>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No expenses recorded</p>
                )}
              </div>
            </div>

            {/* Inventory Items */}
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Inventory Items:
              </Label>
              <div className="space-y-2">
                {budget?.inventoryItems?.length ? (
                  budget.inventoryItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 px-3 bg-gray-50 rounded gap-1"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <span className="text-sm text-gray-700">
                          • {item.itemName}
                        </span>
                        <span className="text-xs text-gray-500">
                          (Qty: {item.remainingQuantity})
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        Rs. {item.price.toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No inventory items used
                  </p>
                )}
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Total Amount:
              </Label>
              <p className="text-lg font-semibold text-gray-900">
                Rs. {budget?.totalAmount?.toLocaleString() || "0"}
              </p>
            </div>

            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Discount:
              </Label>
              <p className="text-lg font-semibold text-gray-900">
                {budget?.discount?.toLocaleString() || "0"} %
              </p>
            </div>

            {/* Final Amount */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Final Amount:
              </Label>
              <p className="text-lg font-semibold text-gray-900">
                Rs. {displayFinalAmount?.toLocaleString() || "0"}
              </p>
            </div>

            {/* Remarks */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Remarks:
              </Label>
              <p className="text-sm text-gray-900">{currentRemarks}</p>
            </div>

            {/* Created By */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Created By:
              </Label>
              <p className="text-sm text-gray-900">
                {budget?.createdBy.userName || "N/A"} - (
                {budget?.createdBy.role || "N/A"})
              </p>
            </div>

            {/* Remarks Field - Show for both approve and reject actions */}
            {showRemarksField && showActionButtons && (
              <div
                className={`flex flex-col space-y-2 ${remarksFieldStyle.containerClass}`}
              >
                <Label className={remarksFieldStyle.labelClass}>
                  {actionType === "approve"
                    ? "Approval Remarks:"
                    : "Rejection Remarks:"}
                </Label>
                <Textarea
                  placeholder={
                    actionType === "approve"
                      ? "Please provide remarks for approval..."
                      : "Please provide reason for rejection..."
                  }
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className={`min-h-[80px] ${remarksFieldStyle.textareaClass}`}
                />
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col gap-2 pt-4">
          {/* Only show action buttons for pending budgets */}
          {showActionButtons ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto order-3 sm:order-1"
                disabled={budgetMutation.isLoading}
              >
                Cancel
              </Button>

              {userType === "client" && (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    className="w-full sm:w-auto order-2"
                    disabled={
                      (showRemarksField && !remarks.trim()) ||
                      budgetMutation.isLoading ||
                      (showRemarksField && actionType === "approve")
                    }
                  >
                    {budgetMutation.isLoading && actionType === "reject"
                      ? "Processing..."
                      : showRemarksField && actionType === "reject"
                        ? "Confirm Reject"
                        : "Reject"}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="w-full sm:w-auto order-1 sm:order-3 bg-green-600 hover:bg-green-700"
                    disabled={
                      (showRemarksField && !remarks.trim()) ||
                      budgetMutation.isLoading ||
                      (showRemarksField && actionType === "reject")
                    }
                  >
                    {budgetMutation.isLoading && actionType === "approve"
                      ? "Processing..."
                      : showRemarksField && actionType === "approve"
                        ? "Confirm Approve"
                        : "Approve"}
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button
              variant="outline"
              onClick={onOpenChange}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
