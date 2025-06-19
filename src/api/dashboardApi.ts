import {
  useQuery,
  UseQueryResult,
} from "react-query";
import authFetch from "./authInterceptor";

interface EventStatusCount {
  status: string;
  count: number;
}

interface EventStatusCountsResponse {
  message: string;
  data: EventStatusCount[];
}

export const useGetEventCountByStatus =
  (): UseQueryResult<EventStatusCountsResponse> => {
    const userType = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    // Build endpoint conditionally
    const endpoint =
      userType === "client"
        ? `/events/events-count-by-status?clientId=${userId}`
        : `/events/events-count-by-status`;

    return useQuery({
      queryKey: [
        "get_event_status_counts",
        userType === "client" ? userId : null,
      ],
      queryFn: async () => {
        const response = await authFetch.get<EventStatusCountsResponse>(
          endpoint
        );
        return response.data;
      },
      onSuccess: () => {
        console.log("Event status counts retrieved successfully");
      },
      onError: (error) => {
        console.error("Error fetching event status counts:", error);
      },
    });
  };

interface UserRoleCount {
  role: string;
  count: number;
}

interface UserRoleCountsResponse {
  message: string;
  data: UserRoleCount[];
}

export const useGetUserCountByRole = (): UseQueryResult<UserRoleCountsResponse> => {
  return useQuery({
    queryKey: ["get_user_role_counts"],
    queryFn: async () => {
      const response = await authFetch.get<UserRoleCountsResponse>("/users/user-count-by-role");
      return response.data;
    },
    onSuccess: () => {
      console.log("User role counts retrieved successfully");
    },
    onError: (error) => {
      console.error("Error fetching user role counts:", error);
    },
  });
};

interface UpcomingEvent {
  _id: string;
  eventName: string;
  startDate: string;
  endDate: string;
  proposedLocation: string;
  status: string;
  progress: number;
  clientId: {
    _id: string;
    userName: string;
  };
}

interface UpcomingEventsResponse {
  message: string;
  events: UpcomingEvent[];
}

export const useGetUpcomingEvents = (): UseQueryResult<UpcomingEventsResponse> => {
  return useQuery({
    queryKey: ["get_upcoming_events"],
    queryFn: async () => {
      const response = await authFetch.get<UpcomingEventsResponse>("/events/upcoming");
      return response.data;
    },
    onSuccess: () => {
      console.log("Upcoming events retrieved successfully");
    },
    onError: (error) => {
      console.error("Error fetching upcoming events:", error);
    },
  });
};

interface TaskStatusCount {
  status: string;
  count: number;
}

interface TaskStatusCountsResponse {
  message: string;
  data: TaskStatusCount[];
}


export const useGetTaskCountsByStatus = (
  userId?: string
): UseQueryResult<TaskStatusCountsResponse> => {
  return useQuery({
    queryKey: ["get_task_status_counts", userId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userId) {
        params.append("userId", userId);
      }

      const response = await authFetch.get<TaskStatusCountsResponse>(
        `/tasks/counts-by-status?${params.toString()}`
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("Task status counts retrieved successfully");
    },
    onError: (error) => {
      console.error("Error fetching task status counts:", error);
    },
  });
};

interface InventoryCountData {
  totalCount: number;
  internalCount: number;
  externalCount: number;
}

interface InventoryCountResponse {
  message: string;
  data: InventoryCountData;
}

export const useGetInventoryItemCount = (): UseQueryResult<InventoryCountResponse> => {
  return useQuery({
    queryKey: ["get_inventory_item_count"],
    queryFn: async () => {
      const response = await authFetch.get<InventoryCountResponse>("/inventory/count");
      return response.data;
    },
    onSuccess: () => {
      console.log("Inventory item counts retrieved successfully");
    },
    onError: (error) => {
      console.error("Error fetching inventory item counts:", error);
    },
  });
};

interface BudgetStatusCount {
  status: string;
  count: number;
}

interface BudgetStatusCountsResponse {
  message: string;
  data: BudgetStatusCount[];
}

export const useGetBudgetCountsByStatus =
  (): UseQueryResult<BudgetStatusCountsResponse> => {
    const userType = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    const endpoint =
      userType === "client"
        ? `/budget/counts-by-status?clientId=${userId}`
        : `/budget/counts-by-status`;

    return useQuery({
      queryKey: [
        "get_budget_status_counts",
        userType === "client" ? userId : null,
      ],
      queryFn: async () => {
        const response = await authFetch.get<BudgetStatusCountsResponse>(
          endpoint
        );
        return response.data;
      },
      onSuccess: () => {
        console.log("Budget status counts retrieved successfully");
      },
      onError: (error) => {
        console.error("Error fetching budget status counts:", error);
      },
    });
  };

interface MonthlyEventCount {
  year: number;
  month: number; // 1 = January, 12 = December
  count: number;
}

interface MonthlyEventCountsResponse {
  message: string;
  data: MonthlyEventCount[];
}

export const useGetMonthlyEventCounts = (): UseQueryResult<MonthlyEventCountsResponse> => {
  return useQuery({
    queryKey: ["get_monthly_event_counts"],
    queryFn: async () => {
      const response = await authFetch.get<MonthlyEventCountsResponse>("/events/events-count");
      return response.data;
    },
    onSuccess: () => {
      console.log("Monthly event counts retrieved successfully");
    },
    onError: (error) => {
      console.error("Error fetching monthly event counts:", error);
    },
  });
};

