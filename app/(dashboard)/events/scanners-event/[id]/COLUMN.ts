import { ColumnDef } from "@tanstack/react-table";

export const COLUMN: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => row.original.user.name,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.user.email,
  },
  {
    accessorKey: "Telefone",
    header: "phone_number",
    cell: ({ row }) => "(258) " + row.original.user.phone_number,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: () => "Activo",
  },
  // {
  //   accessorKey: "entry_date",
  //   header: "Data de entrada",
  //   cell: ({ row }) => row.original.createdAt,
  // },
];
