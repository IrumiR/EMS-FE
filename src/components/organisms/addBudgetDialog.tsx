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

interface Expense {
  expense: string;
  value: string;
}

export function AddBudgetDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [client, setClient] = useState("");
  const [event, setEvent] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([
    { expense: "", value: "" },
  ]);
  const [totalAmount, setTotalAmount] = useState("");
  const eventList = useGetAllEventsDropdown();
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const { data: clientsData, isLoading: clientsLoading } =
    useGetClientOptions();

  // Calculate total from all expense values
  const calculateTotal = () => {
    const total = expenses.reduce((sum, expense) => {
      const value = parseFloat(expense.value) || 0;
      return sum + value;
    }, 0);
    setTotalAmount(total.toString());
  };

  // Update total whenever expenses change
  const handleExpenseChange = (
    index: number,
    field: keyof Expense,
    value: string
  ) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    setExpenses(updatedExpenses);

    // Auto-calculate total if value field changed
    if (field === "value") {
      setTimeout(() => {
        const total = updatedExpenses.reduce((sum, expense) => {
          const val = parseFloat(expense.value) || 0;
          return sum + val;
        }, 0);
        setTotalAmount(total.toString());
      }, 0);
    }
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { expense: "", value: "" }]);
  };

  const handleDeleteExpense = (index: number) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    const finalExpenses = updatedExpenses.length
      ? updatedExpenses
      : [{ expense: "", value: "" }];
    setExpenses(finalExpenses);

    // Recalculate total after deletion
    setTimeout(() => {
      const total = finalExpenses.reduce((sum, expense) => {
        const val = parseFloat(expense.value) || 0;
        return sum + val;
      }, 0);
      setTotalAmount(total.toString());
    }, 0);
  };

  const handleCancel = () => {
    setIsOpen(false);
    // Reset form
    setClient("");
    setEvent("");
    setExpenses([{ expense: "", value: "" }]);
    setTotalAmount("");
  };

  const handleCreateBudget = () => {
    // Add your budget creation logic here
    console.log({
      client,
      event,
      expenses: expenses.filter(
        (exp) => exp.expense.trim() !== "" || exp.value.trim() !== ""
      ),
      totalAmount,
    });

    // Close dialog and reset form
    setIsOpen(false);
    setClient("");
    setEvent("");
    setExpenses([{ expense: "", value: "" }]);
    setTotalAmount("");
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
                value={selectedClientId}
                onValueChange={(value) => setSelectedClientId(value)}
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
            </div>

            {/* Event Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="event">Event</Label>
              <Select
                value={selectedEventId}
                onValueChange={(value) => setSelectedEventId(value)}
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
            </div>

            {/* Expenses Section */}
            <div className="grid gap-3">
              <Label>Expenses</Label>
              {expenses.map((expense, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start sm:items-center"
                >
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
                    disabled={expenses.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateBudget}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Create Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
