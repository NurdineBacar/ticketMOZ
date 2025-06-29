export const mockEvents = [
  {
    id: 1,
    title: "Festival de Verão 2024",
    date: "15 Maio 2024",
    rawDate: new Date(2024, 4, 15),
    location: "Arena Principal, Maputo",
    genre: "Pop",
    price: "150 MZN",
    imageUrl:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800",
  },
  {
    id: 2,
    title: "Rock in Maputo",
    date: "20 Junho 2024",
    rawDate: new Date(2024, 5, 20),
    location: "Cidade da Música, Maputo",
    genre: "Rock",
    price: "250 MZN",
    imageUrl:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800",
  },
  {
    id: 3,
    title: "Jazz Festival",
    date: "10 Julho 2024",
    rawDate: new Date(2024, 6, 10),
    location: "Teatro Municipal, Maputo",
    genre: "Jazz",
    price: "180 MZN",
    imageUrl:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800",
  },
  {
    id: 4,
    title: "Eletrônica Festival",
    date: "5 Maio 2024",
    rawDate: new Date(2024, 4, 5),
    location: "Expo Center, Maputo",
    genre: "Eletrônica",
    price: "200 MZN",
    imageUrl:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800",
  },
  {
    id: 5,
    title: "Hip Hop Summit",
    date: "30 Maio 2024",
    rawDate: new Date(2024, 4, 30),
    location: "Pavilhão de Eventos, Matola",
    genre: "Hip Hop",
    price: "170 MZN",
    imageUrl:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800",
  },
  {
    id: 6,
    title: "Festival de Jazz & Blues",
    date: "12 Junho 2024",
    rawDate: new Date(2024, 5, 12),
    location: "Centro Cultural, Maputo",
    genre: "Jazz",
    price: "150 MZN",
    imageUrl:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800",
  },
  {
    id: 7,
    title: "Amapiano Vibes",
    date: "18 Julho 2024",
    rawDate: new Date(2024, 6, 18),
    location: "Casa de Shows, Matola",
    genre: "Amapiano",
    price: "120 MZN",
    imageUrl:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800",
  },
  {
    id: 8,
    title: "Rock Classic",
    date: "25 Junho 2024",
    rawDate: new Date(2024, 5, 25),
    location: "Estádio Municipal, Maputo",
    genre: "Rock",
    price: "220 MZN",
    imageUrl:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800",
  },
];

export interface EventData {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  ticketsSold: number;
  ticketsTotal: number;
  status: "active" | "upcoming" | "completed";
}

// Mock event data used across multiple components
export const mockEvents2: EventData[] = [
  {
    id: "1",
    name: "Jazz Night",
    date: "May 10, 2025",
    time: "8:00 PM",
    location: "Blue Note Club",
    ticketsSold: 120,
    ticketsTotal: 200,
    status: "active",
  },
  {
    id: "2",
    name: "Rock Festival",
    date: "May 20, 2025",
    time: "4:00 PM",
    location: "City Park Arena",
    ticketsSold: 250,
    ticketsTotal: 300,
    status: "active",
  },
  {
    id: "3",
    name: "Hip Hop Show",
    date: "June 5, 2025",
    time: "9:00 PM",
    location: "Urban Center",
    ticketsSold: 80,
    ticketsTotal: 150,
    status: "upcoming",
  },
  {
    id: "4",
    name: "Electronic Music Night",
    date: "April 15, 2025",
    time: "10:00 PM",
    location: "Pulse Club",
    ticketsSold: 180,
    ticketsTotal: 200,
    status: "completed",
  },
];
