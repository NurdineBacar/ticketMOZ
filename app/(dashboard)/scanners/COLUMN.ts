import { Event } from "@/types/event";
import { LocalScanner } from "@/types/LocalSacnner";
import { ColumnDef } from "@tanstack/react-table";

export const COLUMN: ColumnDef<LocalScanner>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => "",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => "",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => "",
  },
  {
    accessorKey: "Eventos associados",
    header: "Estado",
    cell: ({ row }) => "",
    filterFn: "equals",
  },
  {
    accessorKey: "last_active",
    header: "Ultima vez activo",
    cell: ({ row }) => "",
    filterFn: "equals",
  },
];
