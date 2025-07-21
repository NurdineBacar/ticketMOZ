"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventService } from "@/service/event/event-service";
import { SalesTicketService } from "@/service/sales/sales-ticket";
import { Event } from "@/types/event";
import { SalesTicketType } from "@/types/sales-ticket";
import jsPDF from "jspdf";
import { useAuth } from "@/hooks/useAuth";
import Cookies from "js-cookie";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#000000", "#CCCCCC", "#666666", "#999999"];

export default function ReportsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<SalesTicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const eventService = new EventService();
  const ticketService = new SalesTicketService();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userCookie = Cookies.get("user");
        const userData = userCookie ? JSON.parse(userCookie) : null;

        if (!userData?.id) {
          throw new Error("Dados do usuário não encontrados");
        }

        const [userEventsData, userTicketsData] = await Promise.all([
          eventService.getEventsDash(userData.id),
          ticketService.getAllPromoter(userData.id),
        ]);

        setEvents(userEventsData.data);
        setTickets(userTicketsData.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast.error("Erro ao carregar dados dos relatórios");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Estatísticas
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce(
    (acc, curr) => acc + (curr.tiketType?.price || 0),
    0
  );
  const totalVerified = tickets.filter((t) => t.isUsed).length;

  // Gráfico de vendas por dia
  const salesByDayData = (() => {
    const map: { [date: string]: number } = {};
    tickets.forEach((t) => {
      const date = new Date(t.createdAt).toLocaleDateString("pt-BR");
      map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map).map(([date, sales]) => ({ date, sales }));
  })();

  // Gráfico de vendas por categoria
  const salesByCategoryData = (() => {
    const map: { [type: string]: number } = {};
    tickets.forEach((t) => {
      const type = t.tiketType?.name || "Outro";
      map[type] = (map[type] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  // Performance por evento (apenas eventos com vendas)
  const eventPerformanceData = events
    .map((event) => {
      const eventTickets = tickets.filter(
        (t) => t.tiketType?.ticket?.event?.id === event.id && t.tiketType
      );
      const revenue = eventTickets.reduce(
        (acc, curr) => acc + (curr.tiketType?.price || 0),
        0
      );
      return {
        name: event.title,
        tickets: eventTickets.length,
        revenue,
      };
    })
    .filter((event) => event.tickets > 0); // Filtra apenas eventos com vendas

  // Top eventos por tickets vendidos (apenas eventos com vendas)
  const topEvents = [...eventPerformanceData]
    .sort((a, b) => b.tickets - a.tickets)
    .slice(0, 3);

  // Top clientes por compras (apenas clientes com compras)
  const customerMap: {
    [customer: string]: { tickets: number; spent: number };
  } = {};
  tickets.forEach((t) => {
    const customer = t.user?.name || t.user?.email || "Desconhecido";
    if (!customerMap[customer]) {
      customerMap[customer] = { tickets: 0, spent: 0 };
    }
    customerMap[customer].tickets += 1;
    customerMap[customer].spent += t.tiketType?.price || 0;
  });
  const topCustomers = Object.entries(customerMap)
    .map(([name, data]) => ({ name, ...data }))
    .filter((customer) => customer.tickets > 0) // Filtra apenas clientes com compras
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  const handleExportCSV = (type: "clientes" | "eventos") => {
    try {
      let rows: string[][] = [];
      let filename = "";

      if (type === "clientes") {
        if (topCustomers.length === 0) {
          toast.warning("Nenhum dado de clientes para exportar");
          return;
        }
        rows = [
          ["Cliente", "Bilhetes Adquiridos", "Total Gasto (MZN)"],
          ...topCustomers.map((c) => [
            c.name,
            c.tickets.toString(),
            c.spent.toLocaleString("pt-BR"),
          ]),
        ];
        filename = `clientes_top_${new Date().toISOString().split("T")[0]}.csv`;
      } else {
        if (topEvents.length === 0) {
          toast.warning("Nenhum dado de eventos para exportar");
          return;
        }
        rows = [
          ["Evento", "Bilhetes Vendidos", "Receita Total (MZN)"],
          ...topEvents.map((e) => [
            e.name,
            e.tickets.toString(),
            e.revenue.toLocaleString("pt-BR"),
          ]),
        ];
        filename = `eventos_top_${new Date().toISOString().split("T")[0]}.csv`;
      }

      const csvContent = rows.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Relatório de ${type} exportado com sucesso`);
    } catch (error) {
      console.error(`Erro ao exportar ${type}:`, error);
      toast.error(`Falha ao exportar ${type}`);
    }
  };

  const handleExportPDF = () => {
    try {
      if (topCustomers.length === 0 && topEvents.length === 0) {
        toast.warning("Nenhum dado disponível para gerar PDF");
        return;
      }

      toast.info("Gerando relatório PDF...");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPosition = 20;

      // Título
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text("Relatório de Vendas", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 10;

      doc.setFontSize(12);
      doc.text(
        `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 20;

      // Função para criar tabelas
      const createSimpleTable = (
        headers: string[],
        rows: string[][],
        startY: number
      ) => {
        const colWidth = (pageWidth - 2 * margin) / headers.length;
        const rowHeight = 10;

        // Cabeçalho
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        headers.forEach((header, i) => {
          doc.text(header, margin + i * colWidth, startY);
        });

        // Linha divisória
        doc.setDrawColor(0);
        doc.setLineWidth(0.2);
        doc.line(margin, startY + 5, pageWidth - margin, startY + 5);

        // Conteúdo
        doc.setFont("helvetica", "normal");
        rows.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            doc.text(
              cell,
              margin + colIndex * colWidth,
              startY + (rowIndex + 1) * rowHeight + 5
            );
          });
        });

        return startY + (rows.length + 1) * rowHeight + 10;
      };

      // Tabela de Clientes Top (se houver dados)
      if (topCustomers.length > 0) {
        doc.setFontSize(14);
        doc.text("Clientes Top", margin, yPosition);
        yPosition += 10;

        const clientHeaders = ["Cliente", "Bilhetes", "Total Gasto (MZN)"];
        const clientRows = topCustomers.map((customer) => [
          customer.name,
          customer.tickets.toString(),
          customer.spent.toLocaleString("pt-BR"),
        ]);

        yPosition = createSimpleTable(clientHeaders, clientRows, yPosition);

        if (yPosition > doc.internal.pageSize.height - 50) {
          doc.addPage();
          yPosition = 20;
        }
      }

      // Tabela de Eventos Top (se houver dados)
      if (topEvents.length > 0) {
        doc.setFontSize(14);
        doc.text("Eventos Top", margin, yPosition);
        yPosition += 10;

        const eventHeaders = ["Evento", "Bilhetes Vendidos", "Receita (MZN)"];
        const eventRows = topEvents.map((event) => [
          event.name,
          event.tickets.toString(),
          event.revenue.toLocaleString("pt-BR"),
        ]);

        yPosition = createSimpleTable(eventHeaders, eventRows, yPosition);
      }

      // Salvar PDF
      doc.save(
        `relatorio_vendas_${new Date().toISOString().split("T")[0]}.pdf`
      );
      toast.success("Relatório PDF exportado com sucesso");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Falha ao exportar PDF");
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col h-[90vh] overscroll-y-auto px-6 gap-5">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-3 items-center">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Skeleton className="h-[300px] rounded-lg" />
          <Skeleton className="h-[300px] rounded-lg" />
        </div>

        <Skeleton className="h-[350px] rounded-lg" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </main>
    );
  }

  return (
    <ScrollArea className="h-[90vh]">
      <main className="flex flex-col w-full px-5">
        <header className="flex justify-between items-center flex-wrap gap-3">
          <article className="flex flex-col items-start">
            <h2 className="text-3xl font-bold">Relatórios</h2>
            <span>Análise de todos os eventos</span>
          </article>
          <article className="flex gap-3 items-center">
            <Button
              variant="outline"
              onClick={() => handleExportCSV("clientes")}
              disabled={topCustomers.length === 0}
            >
              <Download className="mr-2 h-4 w-4" /> Exportar Clientes
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportCSV("eventos")}
              disabled={topEvents.length === 0}
            >
              <Download className="mr-2 h-4 w-4" /> Exportar Eventos
            </Button>
            <Button
              onClick={handleExportPDF}
              disabled={topCustomers.length === 0 && topEvents.length === 0}
            >
              Exportar PDF
            </Button>
          </article>
        </header>

        {/* Estatísticas */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          <Card className="col-span-2 md:col-span-1">
            <CardContent>
              <h2 className="font-bold">Total de Bilhetes</h2>
              <div className="text-xl font-bold">{totalTickets}</div>
              {/* <div className="flex items-center">
                <TrendingUp className="text-green-500 mr-1 h-3 w-3" />
                <span className="text-green-500">+8%</span>
                <span className="ml-1">vs. período anterior</span>
              </div> */}
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardContent>
              <h2 className="font-bold">Total Verificados</h2>
              <div className="text-xl font-bold">{totalVerified}</div>
              {/* <div className="flex items-center">
                <TrendingUp className="text-green-500 mr-1 h-3 w-3" />
                <span className="text-green-500 text-sm">+8%</span>
                <span className="ml-1 text-sm">vs. período anterior</span>
              </div> */}
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardContent>
              <h2 className="font-bold">Total em Vendas</h2>
              <div className="text-xl font-bold">
                MZN {totalRevenue.toLocaleString("en-US")}
              </div>
              {/* <div className="flex items-center">
                <TrendingUp className="text-green-500 mr-1 h-3 w-3" />
                <span className="text-green-500">+8%</span>
                <span className="ml-1">vs. período anterior</span>
              </div> */}
            </CardContent>
          </Card>
        </section>

        {/* Gráficos */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Dia</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {salesByDayData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesByDayData}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#000000"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>Nenhum dado de vendas por dia disponível</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendas por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {salesByCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {salesByCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>Nenhum dado de vendas por categoria disponível</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Performance dos Eventos */}
        <section className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle>Performance dos Eventos</CardTitle>
              <CardDescription>Receita gerada por cada evento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {eventPerformanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eventPerformanceData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.1}
                      />
                      <XAxis dataKey="name" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#000000" />
                      <Bar dataKey="tickets" fill="#888888" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>Nenhum dado de performance de eventos disponível</p>
                    <p className="text-sm">
                      Os dados aparecerão aqui quando houver vendas
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabelas de Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5 mb-5">
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Eventos</CardTitle>
              <CardDescription>
                Eventos com maior venda de bilhetes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topEvents.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Evento</th>
                      <th className="text-right py-2">Bilhetes Vendidos</th>
                      <th className="text-right py-2">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topEvents.map((event) => (
                      <tr key={event.name} className="border-b">
                        <td className="py-2">{event.name}</td>
                        <td className="text-right">{event.tickets}</td>
                        <td className="text-right">
                          MZN {event.revenue.toLocaleString("en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <p>Nenhum evento com vendas encontrado</p>
                  <p className="text-sm">
                    Os eventos aparecerão aqui quando houver vendas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clientes Top</CardTitle>
              <CardDescription>
                Clientes que mais compraram bilhetes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topCustomers.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cliente</th>
                      <th className="text-right py-2">Bilhetes</th>
                      <th className="text-right py-2">Total Gasto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer) => (
                      <tr key={customer.name} className="border-b">
                        <td className="py-2">{customer.name}</td>
                        <td className="text-right">{customer.tickets}</td>
                        <td className="text-right">
                          MZN {customer.spent.toLocaleString("en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <p>Nenhum cliente com compras encontrado</p>
                  <p className="text-sm">
                    Os clientes aparecerão aqui quando houver compras
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </ScrollArea>
  );
}
