export interface SalesTicketType {
  id: string;
  ticketTypeID: string;
  qrCode: string;
  paymentMethod: string;
  isUsed: boolean;
  userid: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  tiketType: TiketType;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  user_type: string;
  token: any;
  isVerify: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TiketType {
  id: string;
  name: string;
  quantity: number;
  price: number;
  ticketId: string;
  ticket: Ticket;
}

export interface Ticket {
  id: string;
  createdAt: string;
  updatedAt: string;
  event: Event;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  image: string;
  event_date: string;
  start_time: string;
  end_time: string;
  status: string;
  ticketId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
