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
}
