// components/DataTable.tsx
"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  EditIcon,
  FileText,
  QrCode,
  TrashIcon,
  EyeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: number;
  actions?: {
    update?: (row: TData | string) => void;
    view?: (row: TData | string) => void;
    delete?: (row: TData | string) => void;
    viewScanners?: (row: TData | string) => void;
    generateQR?: (row: TData | string) => void;
  };
  idAccessor?: string; // Chave para acessar o ID do objeto (padrão: 'id')
}

export function MyDataTable<TData, TValue>({
  columns,
  data,
  pagination = 5,
  actions = {},
  idAccessor = "id",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: pagination,
      },
    },
  });

  // Verifica se há alguma ação definida
  const hasActions = Object.values(actions).some(
    (action) => action !== undefined
  );

  const handleAction = (
    action: ((row: TData | string) => void) | undefined,
    row: TData
  ) => {
    if (!action) return;

    // Verifica se a função espera o objeto completo ou apenas o ID
    const param = action.length === 1 ? row : (row as any)[idAccessor];
    action(param);
  };

  return (
    <main className="w-full flex flex-col gap-4">
      {/* Barra de pesquisa global */}
      <header className="flex items-center gap-5">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Pesquisar em todos os campos..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </header>

      {/* Tabela */}
      <section className="w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left">
                    <div
                      className={cn(
                        "flex items-center gap-x-2",
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ChevronUp />,
                        desc: <ChevronDown />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </TableHead>
                ))}
                {hasActions && (
                  <TableHead>
                    <div className="flex justify-end">Ações</div>
                  </TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell>
                      <div className="flex space-x-2 justify-end">
                        {actions.update && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAction(actions.update, row.original)
                            }
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {actions.view && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAction(actions.view, row.original)
                            }
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {actions.delete && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAction(actions.delete, row.original)
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {actions.generateQR && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAction(actions.generateQR, row.original)
                            }
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        )}
                        {actions.viewScanners && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAction(actions.viewScanners, row.original)
                            }
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center py-4 text-muted-foreground"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {/* Paginação */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>
    </main>
  );
}
