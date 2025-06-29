import { ColumnDef } from "@tanstack/react-table";

export const COLUMN: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => row.original.status,
  },
  {
    accessorKey: "last_active",
    header: "Ultima vez activo",
    cell: ({ row }) => row.original.last_active,
  },
];
