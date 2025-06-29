import MyDataTable from "@/components/my-components/data-table";
import StatCard from "@/components/my-components/statcard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col h-[90vh]overscroll-y-auto">
      <header className="mb-5 flex justify-between items-center">
        <article className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Gestao de eventos</h1>
          <span className="text-base text-gray-500">
            Cria e faca gestao dos seus eventos
          </span>
        </article>

        <Button>
          <Plus /> Criar evento
        </Button>
      </header>

      <section className="grid grid-cols-4 gap-4 mb-5">
        <StatCard
          title="Total eventos"
          value={4}
          subtitle="2 ativos, e por acontecer"
          key={1}
        />
        <StatCard
          key={2}
          title="Eventos activos"
          value={2}
          subtitle="2  de 4 eventos"
        />
        <StatCard
          key={3}
          title="Bilhetes vendidos"
          value={630}
          subtitle="70% da capacidade"
        />
        <StatCard
          key={4}
          title="Capacidade total"
          value={830}
          subtitle="De 4 eventos"
        />
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Eventos</CardTitle>
            <CardDescription>Faca gestao dos seus eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <MyDataTable />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
