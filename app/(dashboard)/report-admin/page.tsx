"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserService } from "@/service/user/user-service";
import { EventService } from "@/service/event/event-service";
import { toast } from "sonner";
import { MyDataTable } from "@/components/my-components/data-table";
import { ColumnDef } from "@tanstack/react-table";

type UserType = {
  id: string;
  name: string;
  email: string;
  user_type: "cliente" | "promotor" | "admin" | "scanner";
  isVerify: boolean;
  isApproved?: boolean;
};

type EventType = {
  id: string;
  title: string;
};

export default function AdminDashboard() {
  const userColumns: ColumnDef<UserType>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
      accessorKey: "user_type",
      header: "Tipo",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.user_type}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) =>
        row.original.isVerify ? (
          <span className="text-green-600">Ativo</span>
        ) : row.original.user_type === "promotor" &&
          !row.original.isApproved ? (
          <span className="text-yellow-500">Pendente</span>
        ) : (
          <span className="text-red-500">Bloqueado</span>
        ),
    },
  ];

  const [users, setUsers] = useState<UserType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [filter, setFilter] = useState<
    "all" | "cliente" | "promotor" | "scanner"
  >("all");
  const [loading, setLoading] = useState(true);

  const userService = new UserService();
  const eventService = new EventService();

  // Função para buscar dados
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, eventsData] = await Promise.all([
        userService.getAll(),
        eventService.getEvents(),
      ]);
      setUsers(usersData);
      setEvents(eventsData);
    } catch {
      toast.error("Erro ao carregar dados do admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter((u) =>
    filter === "all" ? true : u.user_type === filter
  );

  const handleApprovePromoter = async (userId: string) => {
    try {
      await userService.approvePromoter(userId);
      toast.success("Promotor aprovado!");
      fetchData();
    } catch {
      toast.error("Erro ao aprovar promotor");
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await userService.blockUser(userId);
      toast.success("Utilizador bloqueado!");
      fetchData();
    } catch {
      toast.error("Erro ao bloquear utilizador");
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await userService.unblockUser(userId);
      toast.success("Utilizador desbloqueado!");
      fetchData();
    } catch {
      toast.error("Erro ao desbloquear utilizador");
    }
  };

  // Estatísticas rápidas
  const totalUsers = users.length;
  const totalPromoters = users.filter((u) => u.user_type === "promotor").length;
  const totalClients = users.filter((u) => u.user_type === "cliente").length;
  const totalBlocked = users.filter((u) => u.isVerify).length;
  const totalEvents = events.length;
  const promotersToApprove = users.filter(
    (u) => u.user_type === "promotor" && !u.isApproved
  ).length;

  if (loading) {
    return (
      <main className="flex flex-col h-[90vh] overscroll-y-auto px-6">
        <span className="text-center">
          Carregando painel do administrador...
        </span>
      </main>
    );
  }

  return (
    <ScrollArea className="h-[90vh]">
      <main className="flex flex-col w-full px-5">
        <header className="flex justify-between items-center flex-wrap gap-3 mb-5">
          <div>
            <h2 className="text-3xl font-bold">Painel do Administrador</h2>
            <span>Relatórios e gestão de utilizadores e eventos</span>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-6">
          <Card>
            <CardContent>
              <h2 className="font-bold">Total de Utilizadores</h2>
              <div className="text-xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-bold">Clientes</h2>
              <div className="text-xl font-bold">{totalClients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-bold">Promotores</h2>
              <div className="text-xl font-bold">{totalPromoters}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-bold">Promotores p/ Aprovar</h2>
              <div className="text-xl font-bold">{promotersToApprove}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-bold">Utilizadores Bloqueados</h2>
              <div className="text-xl font-bold">{totalBlocked}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-bold">Eventos Registados</h2>
              <div className="text-xl font-bold">{totalEvents}</div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilizadores</CardTitle>
              <CardDescription>
                Filtre por tipo e faça gestão dos utilizadores
              </CardDescription>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={filter === "cliente" ? "default" : "outline"}
                  onClick={() => setFilter("cliente")}
                >
                  Clientes
                </Button>
                <Button
                  variant={filter === "promotor" ? "default" : "outline"}
                  onClick={() => setFilter("promotor")}
                >
                  Promotores
                </Button>
                <Button
                  variant={filter === "scanner" ? "default" : "outline"}
                  onClick={() => setFilter("scanner")}
                >
                  Scanner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MyDataTable
                columns={[
                  ...userColumns,
                  {
                    id: "actions",
                    header: "Ações",
                    cell: ({ row }) => (
                      <div className="flex gap-2 justify-center">
                        {row.original.user_type === "promotor" &&
                          !row.original.isApproved && (
                            <Button
                              size="sm"
                              className="mr-2"
                              onClick={() =>
                                handleApprovePromoter(row.original.id)
                              }
                            >
                              Aprovar
                            </Button>
                          )}
                        {row.original.isVerify == true ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleBlockUser(row.original.id)}
                          >
                            Bloquear
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnblockUser(row.original.id)}
                          >
                            Desbloquear
                          </Button>
                        )}
                      </div>
                    ),
                  },
                ]}
                data={filteredUsers}
                pagination={8}
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </ScrollArea>
  );
}
