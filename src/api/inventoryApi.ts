import authFetch from "./authInterceptor";
import { useMutation, useQuery, useQueryClient } from "react-query";

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
      
      const response = await authFetch.post("/api/inventory/create", itemData);
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