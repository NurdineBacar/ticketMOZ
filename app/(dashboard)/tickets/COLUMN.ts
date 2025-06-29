import { Event } from "@/types/event";
import { SalesTicketType } from "@/types/sales-ticket";
import { ColumnDef } from "@tanstack/react-table";

export const COLUMNS: ColumnDef<SalesTicketType>[] = [
  {
    accessorKey: "ticketId",
    header: "ID do Bilhete",
    cell: ({ row }) => row.original?.id,
  },
  {
    accessorKey: "event",
    header: "Evento",
    cell: ({ row }) => row.original?.tiketType?.ticket?.event?.title,
  },
  {
    accessorKey: "type",
    header: "Tipo de Bilhete",
    cell: ({ row }) => row.original.tiketType.name,
  },
  {
    accessorKey: "purchaser",
    header: "Comprador",
    cell: ({ row }) => row.original?.user.name,
    filterFn: "equals",
  },
  {
    accessorKey: "purchaseDate",
    header: "Data de Compra",
    cell: ({ row }) => row.original?.createdAt,
    filterFn: "equals",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => row.original.isUsed + " ",
    filterFn: "equals",
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => row.original?.tiketType.price + " MZN",
    filterFn: "equals",
  },
];
