import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

export default function InviteScanner({ event }: InviteScannerProps) {
  const eventService = new EventService();
  const params = useParams();
  const eventId = params.id as string | undefined;
  const [totalScanners, setTotalScanners] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
      await eventService
        .inviteScanner(eventId, totalScanners)
        .then((response) => {
          toast.success(`${totalScanners} scanner(s) invited successfully!`);
          console.log(response);
        });

      router.refresh();
    } catch (error) {
      toast.error("Failed to invite scanners");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!event?.inviteScanner?.token) return;

    try {
      await navigator.clipboard.writeText(
        `http://localhost:3000/scanner-invite/${event.inviteScanner.token}`
      );
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      toast.error("Falha ao copiar o link");
      console.error(error);
    }
  };

  useEffect(() => {
    const user = Cookies.get("user");
    const inviteUrl = `http://localhost:3000/scanner-invite/${event?.inviteScanner?.token}`;

    if (!user) {
      // Redireciona para login, passando o link do convite como redirect
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(inviteUrl)}`);
    }
    // Se estiver logado, segue normalmente

    console.log(user);
  }, [event, router]);

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
          <DialogDescription>
            {event && event.inviteScanner ? (
              <main>
                <div className="rounded p-3 bg-neutral-200">
                  <Label className="mb-2">
                    Copie o link abaixo e partilhe com seus scanners:
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href={event.inviteScanner.token}
                      className="text-blue-500 underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`http://localhost:3000/scanner-invite/${event.inviteScanner.token}`}
                    </a>
                  </div>
                </div>
              </main>
            ) : (
              <main>
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
                />
              </main>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {event && event.inviteScanner ? (
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
