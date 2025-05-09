import { jwtDecode } from "jwt-decode";
import authFetch from "./authInterceptor";
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryResult,
  } from "react-query";

export interface LoginData {
  email: string;
  password: string;
}

export interface DecodedToken {
    role: string;
    exp: number;
    sub:string
    userName: string;
  }

export const useLoginMutation = (
  onSuccess: (role: string) => void,
  onError: (message: string) => void
) => {
  return useMutation({
    mutationFn: async ({ email, password }: LoginData) => {
      const response = await authFetch.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    },
    onSuccess(data: { token: string }) {
      const { token } = data;
      const decoded: DecodedToken = jwtDecode(token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("token", token);
      localStorage.setItem("userName", decoded.userName);
      onSuccess(decoded.role);
    },
    onError(error) {
      const message = (error as any)?.response?.data?.message || "Login failed";
      onError(message);
    },
  });
};

interface CreateClientData {
  userName: string;
  email: string;
  password: string;
  role: string;
  address: string;
  contactNumber: string;
  isActive: boolean;
}

export const useCreateClient = (
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  return useMutation({
    mutationFn: async (clientData: CreateClientData) => {
      const response = await authFetch.post("/auth/register", clientData); 
      return response.data;
    },
    onSuccess(data) {
      onSuccess("Client created successfully");
    },
    onError(error) {
      const message = (error as any)?.response?.data?.message || "Client creation failed";
      onError(message);
    },
  });
};


export interface User {
  _id: string;
  userName: string;
  email: string;
  contactNumber: string;
  address: string;
  role: "admin" | "manager" | "team-member" | "client";
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API response type
export interface UserResponse {
  message: string;
  users: User[];
  pagination: UserPagination;
}

export const useGetAllUsers = (
  page?: number,
  pageSize?: number,
  search?: string
): UseQueryResult<UserResponse> => {
  return useQuery({
    queryKey: ["get_all_users", page, pageSize, search],
    queryFn: async () => {
      try {
        const response = await authFetch.get<UserResponse>(
          `/users/all?limit=${pageSize ?? 10}&page=${page ?? 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Users retrieved successfully");
    },
    onError: (error) => {
      console.error("Fetch error:", error);
    },
  });
};


export interface UserUpdateData {
  userName?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  role?: "admin" | "manager" | "team-member" | "client";
  profileImage?: string;
  isActive?: boolean;
  password?: string; // Optional for updates
}

export const useUpdateUserMutation = (
  onSuccess?: (data: any) => void,
  onError?: (message: string) => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: string, userData: UserUpdateData }) => {
      const response = await authFetch.put(`/users/${userId}`, userData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user list and the specific user
      queryClient.invalidateQueries(["get_all_users"]);
      queryClient.invalidateQueries(["user", data.user._id]);
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.message || "Failed to update user";
      if (onError) onError(message);
    },
  });
};

export const useGetUserById = (userId: string | null) => {
  return useQuery(["user", userId], async () => {
    if (!userId) return null;
    const response = await authFetch.get(`/users/${userId}`);
    return response.data;
  }, {
    enabled: !!userId, 
  });
};


// Types for Client dropdown
export interface ClientOption {
  userId: string;
  userName: string;
}

export interface ClientsResponse {
  message: string;
  clients: ClientOption[];
}

export const useGetClientOptions = (): UseQueryResult<ClientsResponse> => {
  return useQuery({
    queryKey: ["client_options"],
    queryFn: async () => {
      try {
        // Fetching clients for dropdown
        const response = await authFetch.get<ClientsResponse>(
          "/users/dropdown/clients"
        );
        return {
          message: response.data.message,
          clients: response.data.clients,
        };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Client options retrieved successfully");
    },
    onError: (error) => {
      console.error("Client options fetch error:", error);
    },
  });
};


// Types for Assignee dropdown
export interface AssigneeOption {
  userId: string;
  userName: string;
}

export interface AssigneesResponse {
  message: string;
  assignees: AssigneeOption[];
}

export const useGetAssigneeOptions = (): UseQueryResult<AssigneesResponse> => {
  return useQuery({
    queryKey: ["assignee_options"],
    queryFn: async () => {
      try {
        // Fetching assignees for dropdown
        const response = await authFetch.get<AssigneesResponse>(
          "/users/dropdown/assignees"
        );
        return {
          message: response.data.message,
          assignees: response.data.assignees,
        };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Assignee options retrieved successfully");
    },
    onError: (error) => {
      console.error("Assignee options fetch error:", error);
    },
  });
};
