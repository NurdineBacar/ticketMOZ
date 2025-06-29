export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  user_type: string;
  token?: string;
  company?: Company;
  isVerify?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  SalesTickets: SalesTickets[];
  UserEvent: UserEvent[];
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  nuit_url?: string;
  events: Event[];
  isVerify?: boolean;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt?: Date;
}

export interface InviteScanner {
  id: string;
  token: string;
  total_scanner: number;
  eventID: string;
  event: Event;
  expiresAt: Date;
  acceptedCount: number;
  createdAt: Date;
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
  userEvent: UserEvent[];
  inviteScanner: InviteScanner;
  ticket: Ticket;
  ticketId: string;
  companyId: string;
  company: Company;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Ticket {
  id: string;
  ticketType: TicketType[];
  event?: Event;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TicketType {
  id: string;
  name: string;
  quantity: number;
  price: number;
  SalesTickets: SalesTickets[];
  ticketId: string;
  ticket: Ticket;
}

export interface SalesTickets {
  id: string;
  ticketTypeID: string;
  tiketType: TicketType;
  qrCode: string;
  paymentMethod: string;
  isUsed: boolean;
  userid: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserEvent {
  id: string;
  userId: string;
  eventId: string;
  user: User;
  event: Event;
}
