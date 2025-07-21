"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { EventService } from "@/service/event/event-service";
import { toast } from "sonner";
import { Event } from "@/types/event";
import { User } from "@/types/user";
import Cookies from "js-cookie";

export default function Invite() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  console.log(token);

  const [loading, setLoading] = useState(true);
  const [inviteInfo, setInviteInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [evento, setEvento] = useState<Event | null>(null);
  const eventService = new EventService();
  const [user, setUser] = useState<User | null>();

  const fetchEvent = async () => {
    await eventService.getEventByToken(token).then((response) => {
      if (!response) {
        toast.error("Erro", {
          description: "Erro ao carregar evento",
        });
      }

      setEvento(response);
    });
  };

  useEffect(() => {
    const userCookie = Cookies.get("user");
    const userParsed = userCookie ? (JSON.parse(userCookie) as User) : null;
    setUser(userParsed);

    fetchEvent();
  }, []);

  useEffect(() => {
    async function fetchInvite() {
      setLoading(true);
      setError(null);

      // Simule uma chamada à API para validar o token e buscar dados do convite
      try {
        // Substitua por sua chamada real de API
        if (!token) throw new Error("Token inválido ou ausente.");
        // Exemplo de resposta mockada:

        console.log(token);

        setInviteInfo({
          eventTitle: "Evento Exemplo",
          company: "Empresa Exemplo",
          invitedBy: "Organizador",
        });
      } catch (err: any) {
        setError(err.message || "Erro ao validar convite.");
      } finally {
        setLoading(false);
      }
    }
    fetchInvite();
  }, [token]);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      // Chame sua API para aceitar o convite usando o token
      // await api.post("/scanner/accept-invite", { token });
      if (!user) {
        toast.error("Erro", {
          description: "Erro ao pegar ID do utilizador",
        });
        return;
      }

      const resp = await eventService.acceptInviteScanner(token, user?.id);

      console.log("dados da requiscao:");
      console.log(resp);

      if (resp.success) {
        toast.success("Aceito o convite com sucesso!!!");
        setAccepted(true);
      } else {
        setAccepted(false);
        toast.error(resp.message || "Erro ao acietar convite!!!");
      }
    } catch (err: any) {
      setError("Erro ao aceitar convite.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <span>Carregando convite...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Convite inválido</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>Voltar para início</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (accepted) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Convite aceito!</CardTitle>
            <CardDescription>
              Você agora faz parte da equipe de scanners do evento{" "}
              <b>{inviteInfo.eventTitle}</b>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>Ir para início</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-white px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Convite para ser Scanner</CardTitle>
          <CardDescription>
            Você foi convidado para ser scanner no evento
            <b> {evento?.title}</b> pela empresa
            <b> {evento?.company.name}</b>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <span className="font-medium">Promotor:</span>
            {inviteInfo.invitedBy}
          </div>
          <Button onClick={handleAccept} className="w-full">
            Aceitar convite
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
