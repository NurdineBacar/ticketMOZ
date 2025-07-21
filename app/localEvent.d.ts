import { Event } from "@/types/event";

export interface EventProps {
  id: number;
  title: string;
  date: string;
  rawDate: Date;
  location: string;
  genre: string;
  price: string;
  imageUrl: string;
  hasVIP?: boolean;
  event?: Event;
  ticket?: Ticket;
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
  // SalesTickets: SalesTickets[];
  ticketId: string;
  ticket: Ticket;
}
