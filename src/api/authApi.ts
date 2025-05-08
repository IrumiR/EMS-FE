import { jwtDecode } from "jwt-decode";
import authFetch from "./authInterceptor";
import {
    useMutation,
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
      const response = await authFetch.post("/auth/register", clientData); // Adjust endpoint if needed
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
