import authFetch from "./authInterceptor";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "react-query";

export interface InventoryItemData {
  itemName: string;
  itemDescription?: string;
  category: string[];
  totalQuantity: number;
  remainingQuantity?: number;
  price: number;
  condition: string[];
  variations?: string[];
  images?: string[];
  isExternal?: boolean;
  assignedEvent?: string[];
}

export const useCreateInventoryMutation = (
  onSuccess?: (data: any) => void,
  onError?: (message: string) => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemData: InventoryItemData) => {
      if (!itemData.remainingQuantity) {
        itemData.remainingQuantity = itemData.totalQuantity;
      }
      
      const response = await authFetch.post("/inventory/create", itemData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("inventoryItems");
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.message || "Failed to create inventory item";
      if (onError) onError(message);
    },
  });
};

//getAll
export const useInventoryItems = () => {
  return useQuery("inventoryItems", async () => {
    const response = await authFetch.get("/api/inventory/all");
    return response.data;
  });
};

//getById
export const useInventoryItem = (itemId: string | null) => {
  return useQuery(["inventoryItem", itemId], async () => {
    if (!itemId) return null;
    const response = await authFetch.get(`/api/inventory/${itemId}`);
    return response.data;
  }, {
    enabled: !!itemId, 
  });
};

export const useUpdateInventoryMutation = (
  onSuccess?: (data: any) => void,
  onError?: (message: string) => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, itemData }: { itemId: string, itemData: Partial<InventoryItemData> }) => {
      const response = await authFetch.put(`/api/inventory/${itemId}`, itemData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch inventory list and the specific item
      queryClient.invalidateQueries("inventoryItems");
      queryClient.invalidateQueries(["inventoryItem", data.inventoryItem._id]);
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.message || "Failed to update inventory item";
      if (onError) onError(message);
    },
  });
};


export const useDeleteInventoryMutation = (
  onSuccess?: () => void,
  onError?: (message: string) => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await authFetch.delete(`/api/inventory/${itemId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("inventoryItems");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.message || "Failed to delete inventory item";
      if (onError) onError(message);
    },
  });
};

// InventoryItem interface
export interface InventoryItem {
    _id: string;
    itemName: string;
    itemDescription?: string;
    category: string[];
    totalQuantity: number;
    remainingQuantity: number;
    price: number;
    condition: string[];
    variations: string[];
    images: string[];
    isExternal: boolean;
    assignedEvent: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  // Pagination metadata
  export interface InventoryPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  // API response type
  export interface InventoryResponse {
    message: string;
    inventoryItems: InventoryItem[];
    pagination: InventoryPagination;
  }


  export const useGetAllInventory = (
    page?: number,
    pageSize?: number,
    search?: string
  ): UseQueryResult<InventoryResponse> => {
    return useQuery({
      queryKey: ["get_all_inventory", page, pageSize, search],
      queryFn: async () => {
        try {
          const response = await authFetch.get<InventoryResponse>(
            `/inventory/all?limit=${pageSize ?? 10}&page=${page ?? 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`
          );
          return response.data;
        } catch (error) {
          throw error;
        }
      },
      onSuccess: () => {
        console.log("Inventory items retrieved successfully");
      },
      onError: (error) => {
        console.error("Fetch error:", error);
      },
    });
  };
  

  export interface InventoryOption{
    itemId: string;
    itemName: string;
    remainingQuantity: number;
  }

  export interface InventoryOptionResponse {
    message: string;
    items: InventoryOption[];
  }
  
  export const useGetInventoryOptions = (): UseQueryResult<InventoryOptionResponse> => {
    return useQuery({
      queryKey: ["inventory_options"],
      queryFn: async () => {
        try {
          const response = await authFetch.get<InventoryOptionResponse>("/inventory/all-dropdown");
          return {
            message: response.data.message,
            items: response.data.items,
          };
        } catch (error) {
          throw error;
        }
      },
      onSuccess: () => {
        console.log("Inventory items retrieved successfully");
      },
      onError: (error) => {
        console.error("Fetch error:", error);
      },
    });
  };
