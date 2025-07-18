export interface User {
  id: string;
  name: string;
  email: string;
  user_type: string;
  isVerify: boolean;
  createdAt: string;
  updatedAt: string;
  company: Company;
  SalesTickets: any[];
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  nuit_url: string;
  isVerify: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
