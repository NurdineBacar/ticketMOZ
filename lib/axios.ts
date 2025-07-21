import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4000/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
const api = axios.create({
  baseURL: "https://ticketmoz-backend.onrender.com/",
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
