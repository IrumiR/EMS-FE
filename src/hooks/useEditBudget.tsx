import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useGetAllEventsDropdown } from "@/api/taskApi";
import { useGetClientOptions } from "@/api/authApi";
import { useUpdateBudget } from "@/api/budgetApi";
import { useGetInventoryOptions } from "@/api/inventoryApi";
import { Budget } from "@/components/types";

type Expense = {
  expenseName: string;
  amount: string;
  _id?: string;
};

interface InventoryItem {
  itemId: string;
  quantity: number;
  price: string;
  unitPrice?: number;
  maxQuantity?: number;
  itemName?: string;
  _id?: string;
}

interface UseEditBudgetProps {
  budget?: Budget;
  budgetId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
      }),
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
    }),
  ),
  discountPercentage: Yup.number()
    .transform((_, originalValue) =>
      originalValue === "" ? null : Number(originalValue),
    )
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .nullable(),
  totalAmount: Yup.string()
    .required("Total amount is required")
    .test("is-positive", "Total amount must be greater than 0", (value) => {
      return parseFloat(value || "0") > 0;
    }),
});

const onSuccess = (message: string) => {
  toast.success(message, {
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

export const useEditBudget = ({
  budget,
  budgetId,
  open,
  onOpenChange,
}: UseEditBudgetProps) => {
  const { data: clientsData, isLoading: clientsLoading } =
    useGetClientOptions();
  const { data: inventoryData, isLoading: inventoryLoading } =
    useGetInventoryOptions();
  const { mutate: updateBudget, isLoading: isUpdating } = useUpdateBudget(
    budgetId,
    onSuccess,
    onError,
  );

  const formik = useFormik({
    initialValues: {
      clientId: "",
      eventId: "",
      expenses: [{ expenseName: "", amount: "" }] as unknown as Expense[],
      inventoryItems: [] as InventoryItem[],
      discountPercentage: "",
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
          _id: expense._id,
        })),
        inventoryItems: values.inventoryItems.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName || "",
          remainingQuantity: item.quantity,
          price: parseFloat(item.price),
          ...(item._id ? { _id: item._id } : {}),
        })),
        totalAmount: parseFloat(values.totalAmount),
        discount: values.discountPercentage
          ? Number(values.discountPercentage)
          : 0,
      };

      updateBudget(payload, {
        onSuccess: () => {
          onOpenChange(false);
          formik.resetForm();
        },
        onError: () => {},
      });
    },
  });

  const eventList = useGetAllEventsDropdown(
    formik.values.clientId,
    formik.values.eventId,
  );

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
        inventoryItems:
          budget.inventoryItems?.map((item: any) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.remainingQuantity,
            price: item.price.toString(),
            unitPrice: item.price / item.remainingQuantity,
            maxQuantity: item.remainingQuantity,
            _id: item._id,
          })) || [],
        discountPercentage: budget.discount?.toString() || "",
        totalAmount: budget.totalAmount.toString(),
      });
    }
  }, [budget, open]);

  useEffect(() => {
    const total = calculateTotal();
    formik.setFieldValue("totalAmount", total.toString());
  }, [
    formik.values.expenses,
    formik.values.inventoryItems,
    formik.values.discountPercentage,
  ]);

  const calculateSubtotal = (
    expenses: Expense[] = formik.values.expenses,
    inventoryItems: InventoryItem[] = formik.values.inventoryItems,
  ) => {
    const expenseTotal = expenses.reduce((sum, expense) => {
      const val = parseFloat(expense.amount) || 0;
      return sum + val;
    }, 0);

    const inventoryTotal = inventoryItems.reduce((sum, item) => {
      const val = parseFloat(item.price) || 0;
      return sum + val;
    }, 0);

    return expenseTotal + inventoryTotal;
  };

  const calculateTotal = (
    expenses: Expense[] = formik.values.expenses,
    inventoryItems: InventoryItem[] = formik.values.inventoryItems,
  ) => {
    const subtotal = calculateSubtotal(expenses, inventoryItems);
    const discountPercent = parseFloat(formik.values.discountPercentage) || 0;
    const discountAmount = (subtotal * discountPercent) / 100;

    return Math.max(0, subtotal - discountAmount);
  };

  const handleExpenseChange = (
    index: number,
    field: keyof Expense,
    value: string,
  ) => {
    const updatedExpenses = [...formik.values.expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    formik.setFieldValue("expenses", updatedExpenses, false);

    if (field === "amount") {
      const total = calculateTotal(
        updatedExpenses,
        formik.values.inventoryItems,
      );
      formik.setFieldValue("totalAmount", total.toString(), false);
    }
  };

  const handleInventoryChange = (
    index: number,
    field: keyof InventoryItem,
    value: string | number,
  ) => {
    const updatedInventory = [...formik.values.inventoryItems];
    updatedInventory[index] = { ...updatedInventory[index], [field]: value };

    if (field === "quantity") {
      const unitPrice = updatedInventory[index].unitPrice || 0;
      const totalPrice = (value as number) * unitPrice;
      updatedInventory[index].price = totalPrice.toString();
    }

    formik.setFieldValue("inventoryItems", updatedInventory, false);

    const total = calculateTotal(formik.values.expenses, updatedInventory);
    formik.setFieldValue("totalAmount", total.toString(), false);
  };

  const handleInventoryItemSelect = (index: number, itemId: string) => {
    const selectedItem = inventoryData?.items?.find(
      (item) => item.itemId === itemId,
    );

    if (selectedItem) {
      const selectedQuantity =
        typeof selectedItem.remainingQuantity === "number"
          ? selectedItem.remainingQuantity
          : 1;
      const updatedInventory = [...formik.values.inventoryItems];
      updatedInventory[index] = {
        ...updatedInventory[index],
        itemId,
        itemName: selectedItem.itemName,
        quantity: selectedQuantity,
        maxQuantity: selectedQuantity,
        unitPrice: selectedItem.price,
        price: (selectedQuantity * selectedItem.price).toString(),
      };

      formik.setFieldValue("inventoryItems", updatedInventory, false);

      const total = calculateTotal(formik.values.expenses, updatedInventory);
      formik.setFieldValue("totalAmount", total.toString(), false);
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
    const newExpenses = [
      ...formik.values.expenses,
      { expenseName: "", amount: "" },
    ];
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
      : [{ expenseName: "", amount: "" }];

    formik.setFieldValue("expenses", finalExpenses, false);

    const total = calculateTotal(finalExpenses, formik.values.inventoryItems);
    formik.setFieldValue("totalAmount", total.toString(), false);
  };

  const handleDeleteInventoryItem = (index: number) => {
    const updatedInventory = [...formik.values.inventoryItems];
    updatedInventory.splice(index, 1);

    formik.setFieldValue("inventoryItems", updatedInventory, false);

    const total = calculateTotal(formik.values.expenses, updatedInventory);
    formik.setFieldValue("totalAmount", total.toString(), false);
  };

  const handleDiscountChange = (value: string) => {
    formik.setFieldValue("discountPercentage", value, false);
    const total = calculateTotal();
    formik.setFieldValue("totalAmount", total.toString(), false);
  };

  const handleCancel = () => {
    formik.resetForm();
    onOpenChange(false);
  };

  return {
    // Form state
    formik,

    // API data
    eventList,
    clientsData,
    inventoryData,

    // Loading states
    clientsLoading,
    inventoryLoading,
    isUpdating,

    // Event handlers
    handleExpenseChange,
    handleInventoryChange,
    handleInventoryItemSelect,
    handleQuantityChange,
    handleAddExpense,
    handleAddInventoryItem,
    handleDeleteExpense,
    handleDeleteInventoryItem,
    handleDiscountChange,
    handleCancel,
    calculateSubtotal,
    calculateTotal,
  };
};

export type { Expense, InventoryItem };
