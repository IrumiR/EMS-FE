/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const authFetch = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

authFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      // if (decodedToken.exp < currentTime) {
      //   // Clear expired token and related data
      //   localStorage.removeItem("token");
      //   localStorage.removeItem("type");
      //   localStorage.removeItem("user");
      //   localStorage.removeItem("userType");
      //   localStorage.removeItem("userId");
      //   localStorage.removeItem("email");
      //   localStorage.removeItem("clientID");
      //   window.location.reload();
      //   throw new axios.Cancel("Token expired");
      // }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authFetch;