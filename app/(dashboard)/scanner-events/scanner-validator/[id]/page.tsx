"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgeCheck, XCircle, QrCode } from "lucide-react";
import { ScannerService } from "@/service/scanner/scanner-service";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

type TicketValidation = {
  code: string;
  valid: boolean;
  message: string;
  ticketInfo?: {
    name: string;
    type: string;
    event: string;
    used: boolean;
    usedAt?: string;
  };
};

export default function ScannerPage() {
  const param = useParams();
  const eventId = param.id as string | undefined;
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [validation, setValidation] = useState<TicketValidation | null>(null);
  const [validatedTickets, setValidatedTickets] = useState<TicketValidation[]>(
    []
  );
  const [isScanning, setIsScanning] = useState(false);
  const scannerService = new ScannerService();
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const isInitialMount = useRef(true);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      setScanResult(null);

      const html5Qrcode = new Html5Qrcode("qr-reader");
      html5QrcodeRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          await handleScanSuccess(decodedText);
        },
        () => {
          // Empty error callback to prevent default error handling
        }
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrcodeRef.current) {
        await html5QrcodeRef.current.stop();
        html5QrcodeRef.current = null;
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    try {
      setScanResult(decodedText);
      await stopScanner();

      const verify = await scannerService.verify(decodedText);
      if (verify.success) {
        const result = await validateTicket(decodedText);
        setValidation(result);
        setDialogOpen(true);

        if (result.valid) {
          setValidatedTickets((prev) => [result, ...prev]);
        }
      } else {
        const erro = {
          code: verify.data?.id,
          valid: false,
          message: "Bilhete já usado!",
          ticketInfo: {
            name: verify.data?.user?.name || "Nome não disponível",
            type: verify.data?.tiketType?.name || "Tipo não disponível",
            event:
              verify.data?.tiketType?.ticket?.event?.title ||
              "Evento não disponível",
            used: verify.data?.isUsed || false,
          },
        };
        setValidation(erro);
        setDialogOpen(true);
      }
    } catch (err) {
      console.error("Error processing QR code:", err);
      toast.error("Erro ao processar o bilhete");
    }
  };

  const validateTicket = async (code: string): Promise<TicketValidation> => {
    try {
      const resp = await scannerService.scan(code);

      if (resp.success) {
        return {
          code,
          valid: true,
          message: "Bilhete válido!",
          ticketInfo: {
            name: resp.data?.user?.name || "Nome não disponível",
            type: resp.data?.tiketType?.name || "Tipo não disponível",
            event:
              resp.data?.tiketType?.ticket?.event?.title ||
              "Evento não disponível",
            used: resp.data?.isUsed || false,
          },
        };
      } else {
        return {
          code,
          valid: false,
          message: resp?.message || "Bilhete inválido!",
          ticketInfo: {
            name: resp.data?.user?.name || "Nome não disponível",
            type: resp.data?.tiketType?.name || "Tipo não disponível",
            event:
              resp.data?.tiketType?.ticket?.event?.title ||
              "Evento não disponível",
            used: resp.data?.isUsed || true,
            usedAt: resp.data?.updatedAt || "Data não disponível",
          },
        };
      }
    } catch (error) {
      console.error("Error validating ticket:", error);
      return {
        code,
        valid: false,
        message: "Erro ao validar o bilhete",
      };
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    startScanner(); // Restart scanner after dialog closes
  };

  const fetchTickets = async () => {
    if (eventId) {
      try {
        const response = await scannerService.getScannedTicket(eventId);
        setTickets(response.data || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isScanning]);

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <main className="flex flex-col items-center px-4 py-8 min-h-screen bg-gray-50">
      <Card className="w-full max-w-xl mb-8">
        <CardHeader>
          <CardTitle>Scanner de Bilhetes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            {!isScanning ? (
              <Button onClick={() => setIsScanning(true)} className="gap-2">
                <QrCode className="w-4 h-4" /> Iniciar Scanner
              </Button>
            ) : (
              <>
                <div id="qr-reader" className="w-full"></div>
                <Button
                  variant="outline"
                  onClick={() => setIsScanning(false)}
                  className="mt-2"
                >
                  Cancelar Scanner
                </Button>
              </>
            )}
            {isScanning && (
              <span className="text-gray-500 text-sm">
                Aponte a câmera para o QR Code do bilhete
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de validação */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
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
                <div className="mt-4 space-y-2">
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
                  {validation.ticketInfo.usedAt && (
                    <div>
                      <b>Usado em:</b>{" "}
                      {new Date(validation.ticketInfo.usedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setIsScanning(true)}>
              Escanear outro bilhete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lista de bilhetes validados */}
      <Card className="w-full max-w-xl mt-8">
        <CardHeader>
          <CardTitle>Bilhetes validados</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-gray-400">Nenhum bilhete validado ainda.</div>
          ) : (
            <ul className="space-y-2">
              {tickets.map((ticket, idx) => (
                <li
                  key={`${ticket.id}-${idx}`}
                  className={`flex items-center justify-between gap-3 p-2 rounded ${
                    ticket.isUsed
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <span className="font-mono text-xs">
                    {ticket.qrCode} - {ticket?.user?.name} - {ticket?.updatedAt}{" "}
                    - {ticket?.tiketType?.name}
                  </span>
                  <span>
                    {ticket.isUsed ? (
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
