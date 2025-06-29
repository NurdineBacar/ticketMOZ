export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  user_type: string;
  token?: string;
  company?: Company;
  isVerify?: boolean;
  createdAt: string;
  updatedAt?: string;
  SalesTickets: SalesTickets[];
}

// Defina Company e SalesTickets conforme seus modelos
export interface Company {
  id: string;
  // ...outros campos relevantes...
}

export interface SalesTickets {
  id: string;
  // ...outros campos relevantes...
}
