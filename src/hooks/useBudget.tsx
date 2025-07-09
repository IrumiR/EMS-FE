import { useState } from "react";
import { useGetAllEventsDropdown } from "@/api/taskApi";
import { useGetClientOptions } from "@/api/authApi";
import { useGetInventoryOptions } from "@/api/inventoryApi";
import { useCreateBudget, CreateBudgetData } from "@/api/budgetApi";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";

export interface Expense {
  expense: string;
  value: string;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  price: string;
  unitPrice?: number;
  maxQuantity?: number;
  itemName?: string;
}

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
  inventoryItems: Yup.array().of(
    Yup.object({
      itemId: Yup.string().required("Inventory item is required"),
      quantity: Yup.number()
        .positive("Quantity must be positive")
        .required("Quantity is required"),
      price: Yup.number()
        .positive("Price must be positive")
        .required("Price is required"),
    })
  ),
  totalAmount: Yup.number()
    .positive("Total amount must be positive")
    .required("Total amount is required"),
});

export function useBudget() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: clientsData, isLoading: clientsLoading } =
    useGetClientOptions();
  const { data: inventoryData, isLoading: inventoryLoading } =
    useGetInventoryOptions();

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
      inventoryItems: [] as InventoryItem[],
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
        inventoryItems: values.inventoryItems.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName || "",
          remainingQuantity: item.quantity,
          price: Number(item.price),
        })),
        totalAmount: Number(values.totalAmount),
        createdBy: userId || "",
      };

      createBudgetMutation.mutate(budgetData);
    },
  });

  const eventList = useGetAllEventsDropdown(formik.values.selectedClientId);

  const calculateTotal = () => {
    const expenseTotal = formik.values.expenses.reduce((sum, expense) => {
      const val = parseFloat(expense.value) || 0;
      return sum + val;
    }, 0);

    const inventoryTotal = formik.values.inventoryItems.reduce((sum, item) => {
      const val = parseFloat(item.price) || 0;
      return sum + val;
    }, 0);

    return expenseTotal + inventoryTotal;
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
        const total = calculateTotal();
        formik.setFieldValue("totalAmount", total);
      }, 0);
    }
  };

  const handleInventoryChange = (
    index: number,
    field: keyof InventoryItem,
    value: string | number
  ) => {
    const updatedInventory = [...formik.values.inventoryItems];
    updatedInventory[index] = { ...updatedInventory[index], [field]: value };

    // Calculate price based on quantity and unit price
    if (field === "quantity") {
      const unitPrice = updatedInventory[index].unitPrice || 0;
      const totalPrice = (value as number) * unitPrice;
      updatedInventory[index].price = totalPrice.toString();
    }

    formik.setFieldValue("inventoryItems", updatedInventory);

    // Auto-calculate total
    setTimeout(() => {
      const total = calculateTotal();
      formik.setFieldValue("totalAmount", total);
    }, 0);
  };

  const handleInventoryItemSelect = (index: number, itemId: string) => {
    const selectedItem = inventoryData?.items?.find(
      (item) => item.itemId === itemId
    );

    if (selectedItem) {
      const updatedInventory = [...formik.values.inventoryItems];
      updatedInventory[index] = {
        ...updatedInventory[index],
        itemId,
        itemName: selectedItem.itemName,
        quantity: selectedItem.remainingQuantity,
        maxQuantity: selectedItem.remainingQuantity,
        unitPrice: selectedItem.price,
        price: (selectedItem.remainingQuantity * selectedItem.price).toString(),
      };

      formik.setFieldValue("inventoryItems", updatedInventory);

      // Auto-calculate total
      setTimeout(() => {
        const total = calculateTotal();
        formik.setFieldValue("totalAmount", total);
      }, 0);
    }
  };

  const handleQuantityChange = (index: number, increment: boolean) => {
    const currentQuantity = formik.values.inventoryItems[index].quantity;
    const maxQuantity = formik.values.inventoryItems[index].maxQuantity || 1;

    let newQuantity;
    if (increment) {
      newQuantity = Math.min(currentQuantity + 1, maxQuantity);
    } else {
      newQuantity = Math.max(1, currentQuantity - 1);
    }

    handleInventoryChange(index, "quantity", newQuantity);
  };

  const handleAddExpense = () => {
    const newExpenses = [...formik.values.expenses, { expense: "", value: "" }];
    formik.setFieldValue("expenses", newExpenses);
  };

  const handleAddInventoryItem = () => {
    const newInventoryItems = [
      ...formik.values.inventoryItems,
      { itemId: "", quantity: 1, price: "", unitPrice: 0, maxQuantity: 1 },
    ];
    formik.setFieldValue("inventoryItems", newInventoryItems);
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
      const total = calculateTotal();
      formik.setFieldValue("totalAmount", total);
    }, 0);
  };

  const handleDeleteInventoryItem = (index: number) => {
    const updatedInventory = [...formik.values.inventoryItems];
    updatedInventory.splice(index, 1);
    formik.setFieldValue("inventoryItems", updatedInventory);

    // Recalculate total after deletion
    setTimeout(() => {
      const total = calculateTotal();
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

  return {
    // State
    isOpen,
    setIsOpen,
    formik,

    // Data
    clientsData,
    clientsLoading,
    inventoryData,
    inventoryLoading,
    eventList,
    createBudgetMutation,

    // Handlers
    handleExpenseChange,
    handleInventoryChange,
    handleInventoryItemSelect,
    handleQuantityChange,
    handleAddExpense,
    handleAddInventoryItem,
    handleDeleteExpense,
    handleDeleteInventoryItem,
    handleCancel,
    handleCreateBudget,
  };
}
