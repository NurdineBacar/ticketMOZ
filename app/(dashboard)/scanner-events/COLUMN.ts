import { Event } from "@/types/event";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Nome do Evento",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "date",
    header: "Data & Hora",
    cell: ({ row }) => row.original.event_date + " " + row.original.start_time,
  },
  {
    accessorKey: "solds",
    header: "Tickets Vendidos",
    cell: ({ row }) => {
      // Safely calculate total tickets sold
      const ticket = row.original.ticket;
      if (!ticket || !ticket.ticketType) return 0;

      return ticket.ticketType.reduce((total, type) => {
        return total + (type.SalesTickets?.length || 0);
      }, 0);
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => row.original.status,
    filterFn: "equals",
  },
];
