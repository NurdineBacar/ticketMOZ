"use client";
import StatCard from "@/components/my-components/statcard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventService } from "@/service/event/event-service";
import { Event } from "@/types/event";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MyDataTable } from "@/components/my-components/data-table";
import { toast } from "sonner";
import { User } from "@/types/user";
import Cookies from "js-cookie";
import { columns } from "./COLUMN";
import { useAuth } from "@/hooks/useAuth";

export default function Events() {
  const { id } = useParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventService = new EventService();

  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("ID inválido");
      }

      const response = await eventService.getEventsPromoter(id);
      if (response && response.success) {
        setEvents(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } else {
        setEvents([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Erro no componente:", err);
      setError("Erro ao buscar eventos");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchEvents();
    }
    // Não setar erro se user.id não existe, apenas não faz nada
  }, [user?.id]);

  useEffect(() => {
    console.log("Events atualizados:", events);
  }, [events]);

  // Calculate statistics from events data
  // Calculate statistics from events data
  const totalEvents = events?.length || 0;
  const activeEvents =
    events?.filter((event) => event.status === "active").length || 0;
  const totalTicketsSold =
    events?.reduce((sum, event) => {
      return (
        sum +
        (event.ticket?.ticketType?.reduce((typeSum, type) => {
          return typeSum + (type.SalesTickets?.length || 0);
        }, 0) || 0)
      );
    }, 0) || 0;
  const totalCapacity =
    events?.reduce((sum, event) => {
      return (
        sum +
        (event.ticket?.ticketType?.reduce((typeSum, type) => {
          return typeSum + (type.quantity || 0);
        }, 0) || 0)
      );
    }, 0) || 0;

  if (loading) {
    return (
      <main className="flex flex-col h-[90vh] overscroll-y-auto px-6">
        <span className="text-center">Carregando....</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col h-[90vh] overscroll-y-auto px-6">
        <div className="text-red-500">{error}</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-[90vh] overscroll-y-auto px-6">
      <header className="mb-5 flex flex-wrap justify-between items-center gap-4">
        <article className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Lista de eventos</h1>
        </article>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard
          title="Total eventos"
          value={totalEvents}
          subtitle={`${activeEvents} ativos, a acontecer`}
        />
        <StatCard
          title="Eventos activos"
          value={activeEvents}
          subtitle={`${activeEvents} de ${totalEvents} eventos`}
        />
        <StatCard
          title="Bilhetes vendidos"
          value={totalTicketsSold}
          subtitle={`${Math.round(
            (totalTicketsSold / totalCapacity) * 100
          )}% da capacidade`}
        />
        <StatCard
          title="Capacidade total"
          value={totalCapacity}
          subtitle={`De ${totalEvents} eventos`}
        />
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <MyDataTable columns={columns} data={events ?? []} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
