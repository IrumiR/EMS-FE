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

interface BudgetViewDialogProps {
  open: boolean;
  onOpenChange: () => void;
  budgetData?: {
    eventName: string;
    clientName: string;
    status: string;
    expenses: Array<{ name: string; value: number }>;
    totalAmount: number;
    remarks: string;
    createdBy: string;
  };
}

export default function BudgetViewDialog({ 
  open, 
  onOpenChange,
  budgetData
}: BudgetViewDialogProps) {
  const [showRejectField, setShowRejectField] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");

  const handleReject = () => {
    if (!showRejectField) {
      setShowRejectField(true);
    } else {
      // Handle reject logic here
      console.log("Rejected with remarks:", rejectRemarks);
      // Reset and close
      setShowRejectField(false);
      setRejectRemarks("");
      onOpenChange();
    }
  };

  const handleApprove = () => {
    // Handle approve logic here
    console.log("Budget approved");
    onOpenChange();
  };

  const handleCancel = () => {
    setShowRejectField(false);
    setRejectRemarks("");
    onOpenChange();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          
          <DialogTitle className="text-lg font-semibold text-left">
            View Budget
          </DialogTitle>
          <p className="text-sm text-gray-600 text-left">
            Viewing budget information for event: {budgetData?.eventName || 'N/A'}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Event Name */}
          <div className="flex flex-col space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Event Name:
            </Label>
            <p className="text-sm text-gray-900">{budgetData?.eventName || 'N/A'}</p>
          </div>

          {/* Client Name */}
          <div className="flex flex-col space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Client Name:
            </Label>
            <p className="text-sm text-gray-900">{budgetData?.clientName || 'N/A'}</p>
          </div>

          {/* Status */}
          <div className="flex flex-col space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Status:
            </Label>
            <p className={`text-sm font-medium ${getStatusColor(budgetData?.status || '')}`}>
              {budgetData?.status || 'N/A'}
            </p>
          </div>

          {/* Expenses */}
          <div className="flex flex-col space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Expenses:
            </Label>
            <div className="space-y-2">
              {budgetData?.expenses?.map((expense, index) => (
                <div key={index} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">• {expense.name}</span>
                  <span className="text-sm font-medium text-gray-900">
                    Rs. {expense.value.toLocaleString()}
                  </span>
                </div>
              )) || <p className="text-sm text-gray-500">No expenses recorded</p>}
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex flex-col space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Total Amount:
            </Label>
            <p className="text-lg font-semibold text-gray-900">
              Rs. {budgetData?.totalAmount?.toLocaleString() || '0'}
            </p>
          </div>

          {/* Remarks */}
          <div className="flex flex-col space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Remarks:
            </Label>
            <p className="text-sm text-gray-900">{budgetData?.remarks || 'No remarks'}</p>
          </div>

          {/* Created By */}
          <div className="flex flex-col space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Created By:
            </Label>
            <p className="text-sm text-gray-900">{budgetData?.createdBy || 'N/A'}</p>
          </div>

          {/* Reject Remarks Field */}
          {showRejectField && (
            <div className="flex flex-col space-y-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <Label className="text-sm font-medium text-red-700">
                Rejection Remarks:
              </Label>
              <Textarea
                placeholder="Please provide reason for rejection..."
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                className="min-h-[80px] border-red-300 focus:border-red-500"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto order-3 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            className="w-full sm:w-auto order-2"
          >
            {showRejectField ? "Confirm Reject" : "Reject"}
          </Button>
          <Button
            onClick={handleApprove}
            className="w-full sm:w-auto order-1 sm:order-3 bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
