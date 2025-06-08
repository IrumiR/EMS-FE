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
  totalAmount: number;
  discount?: number;
  remarks?: string;
  createdBy: string;
}

export const useCreateBudget = (
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (budgetData: CreateBudgetData) => {
      const response = await authFetch.post("/budget/create", budgetData);
      return response.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["get_all_budgets"]);
      if (onSuccess) onSuccess(data);
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
  page: number,
  pageSize: number,
  search: string
): UseQueryResult<BudgetResponse> => {
  return useQuery({
    queryKey: ["get_all_budgets", page, pageSize, search],
    queryFn: async () => {
      try {
        const response = await authFetch.get<BudgetResponse>(
          `/budget/all?limit=${pageSize ?? 10}&page=${page ?? 1}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }`
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

export const useGetBudgetById = (
  budgetId: string
): UseQueryResult<Budget> => {
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
}

export const useUpdateBudget = (
  budgetId: string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
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
}

export const useDeleteBudget = (
  budgetId: string,
  onSuccess: (message: string) => void, 
  onError: (message: string) => void
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
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
}

export const useApproveBudget = (
  budgetId: string,
  onSuccess: (message: string) => void, 
  onError: (message: string) => void
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
        const response = await authFetch.put(`/budget/status/${budgetId}`);
        return response.data;
        },
        onSuccess(data) {
        queryClient.invalidateQueries(["get_all_budgets"]);
        if (onSuccess) onSuccess(data.message);
        },
        onError(error) {
        const message =
            (error as any)?.response?.data?.message || "Budget approval failed";
        if (onError) onError(message);
        },
    });
}
