import { useQuery } from "react-query";
import authFetch from "./authInterceptor";

export const useGetNotification = () => {
  const userId = localStorage.getItem("userId");

  return useQuery(
    ["user", userId],
    async () => {
      if (!userId) return null;
      const response = await authFetch.get(`/notifications/${userId}`);
      return response.data;
    },
    {
      enabled: !!userId,
    }
  );
};