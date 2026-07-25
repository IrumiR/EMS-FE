import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import authFetch from "./authInterceptor";

export interface CreateBudgetData {
  eventId: string;
  clientId: string;
  isApproved?: boolean;
  expenses: {
    expenseName: string;
    amount: number;
  }[];
  inventoryItems?: {
    itemId: string;
    itemName: string;
    remainingQuantity: number;
    price: number;
  }[];
  totalAmount: number;
  discount?: number;
  remarks?: string;
  createdBy: string;
}

export const useCreateBudget = (
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (budgetData: CreateBudgetData) => {
      const response = await authFetch.post("/budget/create", budgetData);
      return response.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["get_all_budgets"]);
      const message = data?.message || "Budget created successfully";
      if (onSuccess) onSuccess(message);
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message || "Budget creation failed";
      if (onError) onError(message);
    },
  });
};

export interface Budget {
  _id: string;
  eventId: string;
  clientId: string;
  isApproved?: boolean;
  expenses: {
    expenseName: string;
    amount: number;
  }[];
  totalAmount: number;
  discount?: number;
  remarks?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BudgetPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BudgetResponse {
  message: string;
  budgets: Budget[];
  pagination: BudgetPagination;
}

export const useGetAllBudgets = (
  page?: number,
  pageSize?: number,
  search?: string,
  clientId?: string,
  type?: "Pending" | "Approved" | "Rejected",
): UseQueryResult<BudgetResponse> => {
  return useQuery({
    queryKey: ["get_all_budgets", page, pageSize, search, clientId, type],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (page !== undefined) params.append("page", page.toString());
        if (pageSize !== undefined) params.append("limit", pageSize.toString());
        if (search) params.append("search", search);
        if (clientId) params.append("clientId", clientId);
        if (type) params.append("type", type);

        const response = await authFetch.get<BudgetResponse>(
          `/budget/all/?${params.toString()}`,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Budgets retrieved successfully");
    },
    onError: (error) => {
      console.error("Fetch error:", error);
    },
  });
};

export const useGetBudgetById = (budgetId: string): UseQueryResult<Budget> => {
  return useQuery({
    queryKey: ["get_budget_by_id", budgetId],
    queryFn: async () => {
      try {
        const response = await authFetch.get<Budget>(`/budget/${budgetId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Budget retrieved successfully");
    },
    onError: (error) => {
      console.error("Fetch error:", error);
    },
  });
};

export const useUpdateBudget = (
  budgetId: string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (budgetData: Partial<CreateBudgetData>) => {
      const response = await authFetch.put(`/budget/${budgetId}`, budgetData);
      return response.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["get_all_budgets"]);
      if (onSuccess) onSuccess(data.message);
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message || "Budget update failed";
      if (onError) onError(message);
    },
  });
};

export const useDeleteBudget = (
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (budgetId: string) => {
      const response = await authFetch.delete(`/budget/${budgetId}`);
      return response.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["get_all_budgets"]);
      if (onSuccess) onSuccess(data.message);
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message || "Budget deletion failed";
      if (onError) onError(message);
    },
  });
};

export const useApproveBudget = (
  budgetId: string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      isApproved,
      remarks,
    }: {
      isApproved: boolean;
      remarks: string;
    }) => {
      const response = await authFetch.put(`/budget/status/${budgetId}`, {
        isApproved,
        remarks,
      });
      return response.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["get_all_budgets"]);
      if (onSuccess) onSuccess(data.message);
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message ||
        "Budget status update failed";
      if (onError) onError(message);
    },
  });
};

interface BudgetReport {
  _id: string;
  totalAmount: number;
  createdAt: string;
  isApproved: boolean;
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
}

interface BudgetReportResponse {
  message: string;
  budgets: BudgetReport[];
}

export const useGetBudgetReport = (
  dateRange?: "pastDay" | "pastWeek" | "pastMonth",
): UseQueryResult<BudgetReportResponse> => {
  return useQuery({
    queryKey: ["get_budget_report", dateRange],
    queryFn: async () => {
      const response = await authFetch.get<BudgetReportResponse>(
        "/budget/report",
        {
          params: dateRange ? { dateRange } : {},
        },
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("Budget report data fetched successfully");
    },
    onError: (error) => {
      console.error("Error fetching budget report data:", error);
    },
  });
};
