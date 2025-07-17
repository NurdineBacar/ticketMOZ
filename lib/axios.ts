import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://ticketmoz-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// types/api-response.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
