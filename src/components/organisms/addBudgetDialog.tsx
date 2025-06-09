import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useGetAllEventsDropdown } from "@/api/taskApi";
import { useGetClientOptions } from "@/api/authApi";
import { useCreateBudget, CreateBudgetData } from "@/api/budgetApi";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";

interface Expense {
  expense: string;
  value: string;
}

// Validation schema
const validationSchema = Yup.object({
  selectedClientId: Yup.string().required("Client is required"),
  selectedEventId: Yup.string().required("Event is required"),
  expenses: Yup.array()
    .of(
      Yup.object({
        expense: Yup.string().required("Expense name is required"),
        value: Yup.number()
          .positive("Amount must be positive")
          .required("Amount is required"),
      })
    )
    .min(1, "At least one expense is required"),
  totalAmount: Yup.number()
    .positive("Total amount must be positive")
    .required("Total amount is required"),
});

export function AddBudgetDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const eventList = useGetAllEventsDropdown();
  const { data: clientsData, isLoading: clientsLoading } = useGetClientOptions();

  // Create budget mutation
  const createBudgetMutation = useCreateBudget(
    (message: string) => {
      toast.success(message);
      setIsOpen(false); 
      formik.resetForm(); 
    },
    (message: string) => {
      toast.error(message);
    }
  );

  const formik = useFormik({
    initialValues: {
      selectedClientId: "",
      selectedEventId: "",
      expenses: [{ expense: "", value: "" }] as Expense[],
      totalAmount: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      const userId = localStorage.getItem("userId");

      const budgetData: CreateBudgetData = {
        eventId: values.selectedEventId,
        clientId: values.selectedClientId,
        expenses: values.expenses.map((exp) => ({
          expenseName: exp.expense,
          amount: Number(exp.value),
        })),
        totalAmount: Number(values.totalAmount),
        createdBy: userId || "",
      };

      createBudgetMutation.mutate(budgetData);
    },
  });

  const calculateTotal = () => {
    const total = formik.values.expenses.reduce((sum, expense) => {
      const value = parseFloat(expense.value) || 0;
      return sum + value;
    }, 0);
    formik.setFieldValue("totalAmount", total);
  };

  const handleExpenseChange = (
    index: number,
    field: keyof Expense,
    value: string
  ) => {
    const updatedExpenses = [...formik.values.expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    formik.setFieldValue("expenses", updatedExpenses);

    // Auto-calculate total if value field changed
    if (field === "value") {
      setTimeout(() => {
        const total = updatedExpenses.reduce((sum, expense) => {
          const val = parseFloat(expense.value) || 0;
          return sum + val;
        }, 0);
        formik.setFieldValue("totalAmount", total);
      }, 0);
    }
  };

  const handleAddExpense = () => {
    const newExpenses = [...formik.values.expenses, { expense: "", value: "" }];
    formik.setFieldValue("expenses", newExpenses);
  };

  const handleDeleteExpense = (index: number) => {
    const updatedExpenses = [...formik.values.expenses];
    updatedExpenses.splice(index, 1);
    const finalExpenses = updatedExpenses.length
      ? updatedExpenses
      : [{ expense: "", value: "" }];
    formik.setFieldValue("expenses", finalExpenses);

    // Recalculate total after deletion
    setTimeout(() => {
      const total = finalExpenses.reduce((sum, expense) => {
        const val = parseFloat(expense.value) || 0;
        return sum + val;
      }, 0);
      formik.setFieldValue("totalAmount", total);
    }, 0);
  };

  const handleCancel = () => {
    setIsOpen(false);
    formik.resetForm();
  };

  const handleCreateBudget = () => {
    formik.handleSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex gap-1 bg-green-600 py-2 pl-2 sm:pr-2 pr-2 items-center rounded-md text-white max-h-[38px] text-xsxl">
        <div className="flex items-center gap-1">
          <Plus strokeWidth={1.4} />
          <span className="hidden xl:inline">Create Budget</span>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-center">Add Budget</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="grid gap-4 py-4">
            {/* Client Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={formik.values.selectedClientId}
                onValueChange={(value) => formik.setFieldValue("selectedClientId", value)}
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
              {formik.touched.selectedClientId && formik.errors.selectedClientId && (
                <span className="text-red-500 text-sm">{formik.errors.selectedClientId}</span>
              )}
            </div>

            {/* Event Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="event">Event</Label>
              <Select
                value={formik.values.selectedEventId}
                onValueChange={(value) => formik.setFieldValue("selectedEventId", value)}
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
              {formik.touched.selectedEventId && formik.errors.selectedEventId && (
                <span className="text-red-500 text-sm">{formik.errors.selectedEventId}</span>
              )}
            </div>

            {/* Expenses Section */}
            <div className="grid gap-3">
              <Label>Expenses</Label>
              {formik.values.expenses.map((expense, index) => (
                <div key={index}>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start sm:items-center">
                    {/* Expense Field */}
                    <Input
                      placeholder="Expense"
                      value={expense.expense}
                      onChange={(e) =>
                        handleExpenseChange(index, "expense", e.target.value)
                      }
                      className="w-full"
                    />

                    {/* Value Field */}
                    <Input
                      placeholder="Value"
                      type="number"
                      value={expense.value}
                      onChange={(e) =>
                        handleExpenseChange(index, "value", e.target.value)
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
                  {/* Expense validation errors */}
                  {formik.touched.expenses?.[index] && formik.errors.expenses?.[index] && (
                    <div className="text-red-500 text-sm mt-1">
                      {typeof formik.errors.expenses[index] === 'object' ? (
                        <>
                          {(formik.errors.expenses[index] as any)?.expense && (
                            <div>{(formik.errors.expenses[index] as any).expense}</div>
                          )}
                          {(formik.errors.expenses[index] as any)?.value && (
                            <div>{(formik.errors.expenses[index] as any).value}</div>
                          )}
                        </>
                      ) : (
                        <div>{formik.errors.expenses[index]}</div>
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

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleCreateBudget}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={createBudgetMutation.isLoading}
          >
            {createBudgetMutation.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Budget"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}