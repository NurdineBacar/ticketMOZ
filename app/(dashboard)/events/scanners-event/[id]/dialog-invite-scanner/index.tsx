"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventService } from "@/service/event/event-service";
import { Event } from "@/types/event";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

type InviteScannerProps = {
  event: Event | undefined;
};

interface InviteScannerResponse {
  link: string;
  inviteScanner: {
    token: string;
    // Add other properties if they exist in the response
  };
}

export default function InviteScanner({ event }: InviteScannerProps) {
  const eventService = new EventService();
  const params = useParams();
  const eventId = params.id as string | undefined;
  const [totalScanners, setTotalScanners] = useState<number>(0);
  const [evento, setEvento] = useState<Event | null>(event || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = Cookies.get("user");
    const inviteUrl = `${process.env.NEXT_PORT}/scanner-invite/${event?.inviteScanner?.token}`;

    if (!user) {
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(inviteUrl)}`);
    }
  }, [event, router]);

  const invite = async () => {
    if (!eventId) {
      toast.error("Event ID is missing");
      return;
    }

    if (totalScanners <= 0) {
      toast.error("Please enter a valid number of scanners");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = (await eventService.inviteScanner(
        eventId,
        totalScanners
      )) as InviteScannerResponse;

      // Update local state safely
      setEvento((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          inviteScanner: {
            ...(prev.inviteScanner || {}), // Safely spread existing or empty object
            ...response, // Add/update with new properties
          },
        };
      });

      toast.success(
        `${totalScanners} Link de convite de Scanner criado com sucesso`
      );
      location.reload();
    } catch (error) {
      toast.error("Falha ao criar link de convite");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!evento?.inviteScanner?.token) return;

    const url = `${
      process.env.NEXT_PORT || "http://ticket-moz-seven.vercel.app"
    }/scanner-invite/${evento.inviteScanner.token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência!");
      setIsOpen(false); // Close dialog after copying
    } catch (error) {
      toast.error("Falha ao copiar o link");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Convidar Scanner
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Convite de scanners do evento: {event?.title}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {evento?.inviteScanner ? (
              <div className="mt-4">
                <div className="rounded p-3 bg-neutral-200 dark:bg-neutral-800">
                  <Label className="mb-2">
                    {isSubmitting
                      ? "Gerando link..."
                      : "Copie o link abaixo e partilhe com seus scanners:"}
                  </Label>
                  {!isSubmitting && (
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={`http://ticket-moz-seven.vercel.app/scanner-invite/${evento.inviteScanner.token}`}
                        className="text-blue-500 underline break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`http://ticket-moz-seven.vercel.app/scanner-invite/${evento.inviteScanner.token}`}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Label className="text-gray-400">
                  Insira o número de scanners que deseja convidar para este
                  evento
                </Label>
                <div className="h-4"></div>
                <Input
                  type="number"
                  min="1"
                  placeholder="Número de scanners"
                  onChange={(e) => setTotalScanners(Number(e.target.value))}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>
        </DialogHeader>
        <DialogFooter>
          {evento?.inviteScanner ? (
            <Button onClick={copyToClipboard}>Copiar Link</Button>
          ) : (
            <Button
              onClick={invite}
              disabled={isSubmitting || totalScanners <= 0}
            >
              {isSubmitting ? "Processando..." : "Gerar Convite"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
