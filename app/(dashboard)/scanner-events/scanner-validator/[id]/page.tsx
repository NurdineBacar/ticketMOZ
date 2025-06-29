"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgeCheck, XCircle } from "lucide-react";

// Importa dinamicamente para evitar problemas de SSR
const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  {
    ssr: false,
    loading: () => <p>Loading scanner...</p>,
  }
);

type TicketValidation = {
  code: string;
  valid: boolean;
  message: string;
  ticketInfo?: {
    name: string;
    type: string;
    event: string;
    used: boolean;
  };
};

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [validation, setValidation] = useState<TicketValidation | null>(null);
  const [validatedTickets, setValidatedTickets] = useState<TicketValidation[]>(
    []
  );

  // Simula validação do ticket (substitua por chamada real à API)
  const validateTicket = async (code: string): Promise<TicketValidation> => {
    // Exemplo: se o código termina com "USED", já foi usado
    if (code.endsWith("USED")) {
      return {
        code,
        valid: false,
        message: "Bilhete já foi usado!",
        ticketInfo: {
          name: "João Scanner",
          type: "VIP",
          event: "Evento Exemplo",
          used: true,
        },
      };
    }
    // Se não, é válido
    return {
      code,
      valid: true,
      message: "Bilhete válido!",
      ticketInfo: {
        name: "João Scanner",
        type: "Normal",
        event: "Evento Exemplo",
        used: false,
      },
    };
  };

  const handleScan = async (data: string | null) => {
    if (data) {
      setScanResult(data);
      const result = await validateTicket(data);
      setValidation(result);
      setDialogOpen(true);

      // Se for válido, adiciona à lista de validados
      if (result.valid) {
        setValidatedTickets((prev) => [result, ...prev]);
      }
    }
  };

  const handleError = (err: any) => {
    console.error("Erro ao ler QR Code:", err);
  };

  return (
    <main className="flex flex-col items-center px-4 py-8 min-h-screen bg-gray-50">
      <Card className="w-full max-w-xl mb-8">
        <CardHeader>
          <CardTitle>Scanner de Bilhetes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            {/* <Scanner
              onError={handleError}
              onResult={(result: { text: string }) => handleScan(result?.text ?? null)}
              style={{ width: "100%" }}
            /> */}
            <span className="text-gray-500 text-sm">
              Aponte a câmera para o QR Code do bilhete
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de validação */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {validation?.valid ? (
                <span className="flex items-center gap-2 text-green-600">
                  <BadgeCheck className="w-5 h-5" /> Bilhete válido
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" /> Bilhete inválido
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              {validation?.message}
              {validation?.ticketInfo && (
                <div className="mt-4 space-y-1">
                  <div>
                    <b>Nome:</b> {validation.ticketInfo.name}
                  </div>
                  <div>
                    <b>Tipo:</b> {validation.ticketInfo.type}
                  </div>
                  <div>
                    <b>Evento:</b> {validation.ticketInfo.event}
                  </div>
                  <div>
                    <b>Status:</b>{" "}
                    {validation.ticketInfo.used ? (
                      <span className="text-red-500">Já usado</span>
                    ) : (
                      <span className="text-green-500">Disponível</span>
                    )}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Lista de bilhetes validados */}
      <Card className="w-full max-w-xl mt-8">
        <CardHeader>
          <CardTitle>Bilhetes validados por você</CardTitle>
        </CardHeader>
        <CardContent>
          {validatedTickets.length === 0 ? (
            <div className="text-gray-400">Nenhum bilhete validado ainda.</div>
          ) : (
            <ul className="space-y-2">
              {validatedTickets.map((ticket, idx) => (
                <li
                  key={ticket.code + idx}
                  className={`flex items-center gap-3 p-2 rounded ${
                    ticket.valid
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <span className="font-mono text-xs">{ticket.code}</span>
                  <span>
                    {ticket.ticketInfo?.name} ({ticket.ticketInfo?.type})
                  </span>
                  <span>
                    {ticket.valid ? (
                      <BadgeCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
