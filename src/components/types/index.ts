export type UserRole = "admin" | "client" | "manager" | "team-member";

export interface Expense {
  expenseName: string;
  amount: number;
  _id?: string;
}

export interface Budget {
  _id: string;
  eventId: {
    _id: string;
    eventName: string;
  };
  clientId: {
    _id: string;
    userName: string;
  };
  createdBy: {
    _id: string;
    userName: string;
  };

  isApproved: boolean;
  expenses: Array<{
    expenseName: string;
    amount: number;
    _id: string;
  }>;
  inventoryItems: Array<{
    itemId: string;
    itemName: string;
    remainingQuantity: number;
    price: number;
    _id?: string;
  }>;
  totalAmount: number;
  discount: number;
  remarks: string;
}
