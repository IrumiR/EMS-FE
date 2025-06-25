import { useMutation, useQuery, useQueryClient } from "react-query";
import authFetch from "./authInterceptor";

export const useGetNotification = () => {
  const userId = localStorage.getItem("userId");

  return useQuery(
    ["user_notifications", userId],
    async () => {
      if (!userId) return null;
      const response = await authFetch.get(`/notifications/${userId}`);
      return response.data;
    }
  );
};

interface UpdateNotificationData {
  userId: string;
  notificationIds: string[];
}

export const useUpdateNotification = (
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationData: Partial<UpdateNotificationData>) => {
      const response = await authFetch.patch(`/notifications/read`, notificationData);
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries(["user_notifications"]);
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message || "Notifications update failed";
      if (onError) onError(message);
    },
  });
};