// ...existing code...

import { UserType } from "@/types/user";

export const userAdmin: UserType = {
  id: "1",
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
};

export const userAgent: UserType = {
  id: "2",
  email: "agent@example.com",
  name: "Agent User",
  role: "agent",
  companyName: "Tech Solutions",
  taxId: "123456789",
  photoURL: "https://example.com/photo.jpg",
};

export const userCliente: UserType = {
  id: "3",
  email: "cliente@example.com",
  name: "Cliente User",
  role: "cliente",
};
// ...existing code...
