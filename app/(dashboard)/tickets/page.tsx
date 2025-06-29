"use client";
import { MyDataTable } from "@/components/my-components/data-table";
import MyCard from "@/components/my-components/my-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TicketService } from "@/service/tickets/ticket-service";
import { TicketType } from "@/types/event";
import { Download } from "lucide-react";
import { use, useEffect, useState } from "react";
import { COLUMNS } from "./COLUMN";
import { SalesTicketService } from "@/service/sales/sales-ticket";
import { SalesTicketType } from "@/types/sales-ticket";

export default function Ticket() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [salesTicket, setSalesTicket] = useState<SalesTicketType[]>([]);

  const salesService = new SalesTicketService();

  const fetchSales = async () => {
    await salesService.getAll().then((response) => {
      setSalesTicket(response);
    });
  };

  const [total, setTotal] = useState<number>();

  useEffect(() => {
    const ticketService = new TicketService();
    const fetchTickets = async () => {
      const fetch = await ticketService.getAllTicketType();
      console.log("Tickets fetched:", fetch);
      setTickets(fetch);
    };
    fetchTickets();
    fetchSales();
  }, []);

  useEffect(() => {
    const totalVendas = salesTicket.reduce(
      (acc, curr) => acc + (curr.tiketType.price || 0),
      0
    );
    setTotal(totalVendas);
  }, [salesTicket]);

  return (
    <main className="flex flex-col px-5">
      <header className="flex justify-between items-center gap-2 mb-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold">Gestao de bilhetes</h2>
          <span className="text-gray-500">Gira seus bilhetes</span>
        </div>

        <Button>
          <Download /> Exportar CSV
        </Button>
      </header>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-5">
        <MyCard
          title="Total Bilhetes"
          value={salesTicket.length.toString() || "N/A"}
        />
        <MyCard title="Vendidos" value="150" />
        <MyCard title="Verificados" value="150" />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-4xl font-bold">
              MZN {total?.toLocaleString("en-US") ?? "0.00"}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Bilhetes</CardTitle>
            <CardDescription>Gira todos os seus bilhetes</CardDescription>
          </CardHeader>
          <CardContent>
            <MyDataTable columns={COLUMNS} data={salesTicket} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
