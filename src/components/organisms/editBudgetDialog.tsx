import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useGetAllEventsDropdown } from "@/api/taskApi";
import { useGetClientOptions } from "@/api/authApi";
import { useUpdateBudget } from "@/api/budgetApi";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Budget } from "../types";

type Expense = {
  expenseName: string;
  amount: string; 
  _id?: string;
};



interface EditBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget ;
  budgetId: string
}

// Validation schema
const validationSchema = Yup.object({
  clientId: Yup.string().required("Client is required"),
  eventId: Yup.string().required("Event is required"),
  expenses: Yup.array()
    .of(
      Yup.object({
        expenseName: Yup.string().required("Expense name is required"),
        amount: Yup.string()
          .required("Amount is required")
          .test("is-positive", "Amount must be greater than 0", (value) => {
            return parseFloat(value || "0") > 0;
          }),
      })
    )
    .min(1, "At least one expense is required"),
  totalAmount: Yup.string()
    .required("Total amount is required")
    .test("is-positive", "Total amount must be greater than 0", (value) => {
      return parseFloat(value || "0") > 0;
    }),
});

const onSuccess = () => {
  toast.success("Budget updated successfully!", {
    id: "success-toast",
    position: "top-center",
    duration: 3000,
  });
};

const onError = (message: string) => {
  toast.error(message, {
    id: "error-toast",
    position: "top-center",
    duration: 4000,
  });
};

export function EditBudgetDialog({ open, onOpenChange, budget, budgetId }: EditBudgetDialogProps) {
  const eventList = useGetAllEventsDropdown();
  const { data: clientsData, isLoading: clientsLoading } = useGetClientOptions();
  const { mutate: updateBudget, isLoading: isUpdating } = useUpdateBudget(
    budgetId,
    onSuccess,
    onError
  );

  const formik = useFormik({
    initialValues: {
      clientId: "",
      eventId: "",
      expenses: [{ expenseName: "", amount: "" }] as unknown as Expense[],
      totalAmount: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (!budget?._id) {
        toast.error("Budget ID is missing");
        return;
      }

      const payload = {
        budgetId: budget._id,
        eventId: values.eventId,
        clientId: values.clientId,
        expenses: values.expenses.map((expense) => ({
          expenseName: expense.expenseName,
          amount: parseFloat(expense.amount),
          _id: expense._id, // Include _id if it exists for updates
        })),
        totalAmount: parseFloat(values.totalAmount),
      };

      updateBudget(payload, {
        onSuccess: (response) => {
          toast.success("Budget updated successfully!");
          onOpenChange(false);
          formik.resetForm();
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "Failed to update budget";
          toast.error(errorMessage);
        },
      });
    },
  });

  // Populate form when budget data is available
  useEffect(() => {
    if (budget && open) {
      formik.setValues({
        clientId: budget.clientId._id,
        eventId: budget.eventId._id,
        expenses: budget.expenses.map((expense) => ({
          expenseName: expense.expenseName,
          amount: expense.amount.toString(),
          _id: expense._id,
        })),
        totalAmount: budget.totalAmount.toString(),
      });
    }
  }, [budget, open]);

  // Calculate total from all expense amounts
  const calculateTotal = () => {
    const total = formik.values.expenses.reduce((sum, expense) => {
      const value = parseFloat(expense.amount) || 0;
      return sum + value;
    }, 0);
    formik.setFieldValue("totalAmount", total.toString());
  };

  const handleExpenseChange = (index: number, field: keyof Expense, value: string) => {
    const updatedExpenses = [...formik.values.expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    formik.setFieldValue("expenses", updatedExpenses);

    // Auto-calculate total if amount field changed
    if (field === "amount") {
      setTimeout(() => {
        const total = updatedExpenses.reduce((sum, expense) => {
          const val = parseFloat(expense.amount) || 0;
          return sum + val;
        }, 0);
        formik.setFieldValue("totalAmount", total.toString());
      }, 0);
    }
  };

  const handleAddExpense = () => {
    const newExpenses = [...formik.values.expenses, { expenseName: "", amount: "" }];
    formik.setFieldValue("expenses", newExpenses);
  };

  const handleDeleteExpense = (index: number) => {
    const updatedExpenses = [...formik.values.expenses];
    updatedExpenses.splice(index, 1);
    const finalExpenses = updatedExpenses.length
      ? updatedExpenses
      : [{ expenseName: "", amount: "" }];
    formik.setFieldValue("expenses", finalExpenses);

    // Recalculate total after deletion
    setTimeout(() => {
      const total = finalExpenses.reduce((sum, expense) => {
        const val = parseFloat(expense.amount) || 0;
        return sum + val;
      }, 0);
      formik.setFieldValue("totalAmount", total.toString());
    }, 0);
  };

  const handleCancel = () => {
    formik.resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Budget</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 min-h-0">
          <ScrollArea className="flex-1 min-h-0">
            <div className="grid gap-4 py-4 pr-4">
              {/* Client Dropdown */}
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={formik.values.clientId}
                  onValueChange={(value) => formik.setFieldValue("clientId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsLoading ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading clients...
                        </div>
                      </SelectItem>
                    ) : clientsData?.clients?.length ? (
                      clientsData.clients.map((client) => (
                        <SelectItem key={client.userId} value={client.userId}>
                          {client.userName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-clients" disabled>
                        No clients available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.clientId && formik.errors.clientId && (
                  <span className="text-red-500 text-sm">{formik.errors.clientId}</span>
                )}
              </div>

              {/* Event Dropdown */}
              <div className="grid gap-2">
                <Label htmlFor="event">Event</Label>
                <Select
                  value={formik.values.eventId}
                  onValueChange={(value) => formik.setFieldValue("eventId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventList.data?.events?.length ? (
                      eventList.data.events.map((event) => (
                        <SelectItem key={event._id} value={event._id}>
                          {event.eventName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-events" disabled>
                        No events available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.eventId && formik.errors.eventId && (
                  <span className="text-red-500 text-sm">{formik.errors.eventId}</span>
                )}
              </div>

              {/* Expenses Section */}
              <div className="grid gap-3 overflow-auto">
                <Label>Expenses</Label>
                {formik.values.expenses.map((expense, index) => (
                  <div key={index}>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start sm:items-center">
                      {/* Expense Name Field */}
                      <Input
                        placeholder="Expense"
                        value={expense.expenseName}
                        onChange={(e) =>
                          handleExpenseChange(index, "expenseName", e.target.value)
                        }
                        className="w-full"
                      />

                      {/* Amount Field */}
                      <Input
                        placeholder="Value"
                        type="number"
                        value={expense.amount}
                        onChange={(e) =>
                          handleExpenseChange(index, "amount", e.target.value)
                        }
                        className="w-full"
                      />

                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExpense(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 justify-self-end sm:justify-self-auto"
                        disabled={formik.values.expenses.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Validation errors for this expense */}
                    {formik.touched.expenses?.[index] && formik.errors.expenses?.[index] && (
                      <div className="mt-1">
                        {typeof formik.errors.expenses[index] === 'object' && (
                          <>
                            {(formik.errors.expenses[index] as any)?.expenseName && (
                              <span className="text-red-500 text-sm block">
                                {(formik.errors.expenses[index] as any).expenseName}
                              </span>
                            )}
                            {(formik.errors.expenses[index] as any)?.amount && (
                              <span className="text-red-500 text-sm block">
                                {(formik.errors.expenses[index] as any).amount}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Expenses Button */}
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddExpense}
                    className="w-full"
                  >
                    Add Expenses
                  </Button>
                </div>
              </div>

              {/* Total Amount Field */}
              <div className="grid gap-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  placeholder="Total Amount"
                  type="number"
                  value={formik.values.totalAmount}
                  onChange={formik.handleChange}
                  className="w-full"
                />
                {formik.touched.totalAmount && formik.errors.totalAmount && (
                  <span className="text-red-500 text-sm">{formik.errors.totalAmount}</span>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="flex justify-between sm:justify-between pt-4 border-t flex-shrink-0">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}