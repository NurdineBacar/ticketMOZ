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
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { COLUMNS } from "./COLUMN";
import { SalesTicketService } from "@/service/sales/sales-ticket";
import { SalesTicketType } from "@/types/sales-ticket";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Ticket() {
  const [salesTicket, setSalesTicket] = useState<SalesTicketType[]>([]);
  const [totalVerifyed, setTotalVerifyed] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const { user } = useAuth();

  const salesService = new SalesTicketService();

  const fetchSales = async () => {
    console.log(user);

    if (!user) {
      console.error("User ID is not available");
      return;
    }

    try {
      const response = await salesService.getAllPromoter(user.id);
      setSalesTicket(response.data || []);
      console.log("Resposta");
      console.log(response);
    } catch (error) {
      console.error("Error fetching sales:", error);
      setSalesTicket([]);
    }
  };

  const handleExportCSV = () => {
    try {
      const rows = [
        [
          "ID",
          "Cliente",
          "Email",
          "Tipo Bilhete",
          "Preço",
          "Verificado",
          "Data da Venda",
        ],
        ...(salesTicket?.map((t) => [
          t.id || "",
          t.user?.name || "",
          t.user?.email || "",
          t.tiketType?.name || "",
          t.tiketType?.price?.toString() || "0",
          t.isUsed ? "Sim" : "Não",
          t.createdAt ? new Date(t.createdAt).toLocaleString("pt-BR") : "",
        ]) || []),
      ];

      const csvContent = rows.map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vendas.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV");
    }
  };

  useEffect(() => {
    fetchSales();
  }, [user]);

  useEffect(() => {
    const totalVendas = salesTicket.reduce(
      (acc, curr) => acc + (curr.tiketType?.price || 0),
      0
    );

    const tverifyed = salesTicket.filter((t) => t.isUsed === true).length;
    setTotalVerifyed(tverifyed);
    setTotal(totalVendas);
  }, [salesTicket]);

  return (
    <main className="flex flex-col px-5">
      <header className="flex justify-between items-center gap-2 mb-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold">Gestao de bilhetes</h2>
          <span className="text-gray-500">Gira seus bilhetes</span>
        </div>

        <Button
          onClick={handleExportCSV}
          disabled={salesTicket.length > 0 ? false : true}
          className={cn(
            salesTicket.length > 0
              ? "hover:cursor-pointer"
              : "hover:cursor-not-allowed"
          )}
        >
          <Download /> Exportar CSV
        </Button>
      </header>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-5">
        <MyCard
          title="Total Bilhetes"
          value={salesTicket.length?.toString() ?? "0"}
        />
        <MyCard
          title="Vendidos"
          value={salesTicket.length?.toString() ?? "0"}
        />
        <MyCard title="Verificados" value={totalVerifyed?.toString() ?? "0"} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
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
            <MyDataTable columns={COLUMNS} data={salesTicket || []} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
