"use client";

import QRCodeGenerator from "@/components/my-components/qrdcode";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TicketService } from "@/service/tickets/ticket-service";

export default function DetailsEvent() {
  const param = useParams();
  const eventId = param.id as string | undefined;
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketService = new TicketService();
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ticketRef.current || isDownloading) return;

    setIsDownloading(true);
    toast.info("Preparando seu bilhete para download...");

    try {
      // Forçar reflow e garantir que o componente está renderizado
      const reflow = ticketRef.current.offsetHeight;
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Salvar estilos originais
      const originalStyles = {
        overflow: ticketRef.current.style.overflow,
        position: ticketRef.current.style.position,
        zIndex: ticketRef.current.style.zIndex,
      };

      // Aplicar estilos temporários para melhor captura
      ticketRef.current.style.overflow = "visible";
      ticketRef.current.style.position = "relative";
      ticketRef.current.style.zIndex = "0";

      // Gerar imagem com alta qualidade
      const dataUrl = await toPng(ticketRef.current, {
        quality: 1,
        backgroundColor: "#ffffff",
        pixelRatio: 3,
        cacheBust: true,
        skipFonts: true,
      });

      // Restaurar estilos originais
      ticketRef.current.style.overflow = originalStyles.overflow;
      ticketRef.current.style.position = originalStyles.position;
      ticketRef.current.style.zIndex = originalStyles.zIndex;

      // Criar PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
      });

      // Obter dimensões da imagem
      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Calcular dimensões para o PDF (A4 com margens)
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (img.height * pdfWidth) / img.width;

      // Verificar se a altura excede a página A4
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (pdfHeight > pageHeight - 20) {
        // Redimensionar proporcionalmente
        const ratio = (pageHeight - 20) / pdfHeight;
        pdf.addImage(
          dataUrl,
          "PNG",
          10,
          10,
          pdfWidth * ratio,
          pdfHeight * ratio
        );
      } else {
        // Centralizar verticalmente
        const yOffset = (pageHeight - pdfHeight) / 2;
        pdf.addImage(dataUrl, "PNG", 10, yOffset, pdfWidth, pdfHeight);
      }

      // Salvar o PDF
      pdf.save(
        `bilhete-${event?.tiketType?.ticket?.event?.title || "evento"}.pdf`
      );
      toast.success("Bilhete baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Ocorreu um erro ao baixar o bilhete. Tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    async function fetchEvent() {
      if (typeof eventId === "string") {
        try {
          const resp = await ticketService.getSaledTicketById(eventId);
          setEvent(resp);
        } catch (error) {
          console.error("Error fetching event:", error);
          toast.error("Erro ao carregar os detalhes do evento.");
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Invalid eventId:", eventId);
        setLoading(false);
        toast.error("ID do evento inválido.");
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <div className="w-full text-center py-8">Carregando...</div>;
  }

  if (!event) {
    return <div className="w-full text-center py-8">Evento não encontrado</div>;
  }

  // Format date and time
  const eventDate = event?.tiketType?.ticket?.event?.event_date
    ? new Date(event.tiketType.ticket.event.event_date).toLocaleDateString(
        "pt-PT",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "N/A";

  const eventTime = event?.tiketType?.ticket?.event?.start_time || "N/A";
  const location =
    event?.tiketType?.ticket?.event?.location || "21 Movie Cineplex, Amsterdam";
  const seats = event?.seats?.join(", ") || "G4, G5, G6";

  return (
    <main className={cn("w-full pt-4 mt-[1vh] pb-5", loading ? "" : "px-5")}>
      {/* Ticket Container */}
      <div
        ref={ticketRef}
        id="ticket-container"
        className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200"
        style={{
          position: "relative",
          zIndex: 0,
        }}
      >
        {/* Movie Title Section */}
        <div className="bg-gray-900 text-white p-6 relative h-96">
          <div className="absolute inset-0 opacity-30">
            <img
              src={event?.tiketType?.ticket?.event?.image}
              alt="Movie Banner"
              className="w-full h-full object-cover"
              crossOrigin="anonymous" // Importante para evitar problemas com CORS
            />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold">
              {event?.tiketType?.ticket?.event?.title || "Interstellar"}
            </h1>

            <p className="mt-3 text-gray-300 text-sm absolute top-64">
              {event?.tiketType?.ticket?.event?.description ||
                "A Star Wars Story itself focuses on the Rebel Alliance which recruits Jim Erso (Felicity Jones) after the formation of the Galaxy earning his livin... More"}
            </p>
          </div>
        </div>

        {/* Ticket Details Section */}
        <div className="bg-black text-white p-6">
          <h1 className="text-xl font-bold mb-4 text-center">
            {event?.tiketType?.ticket?.event?.title || "Interstellar"}
          </h1>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-6">
            <div>
              <p className="text-gray-400 text-xs uppercase">Localização</p>
              <p className="font-medium">{location}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Data</p>
              <p className="font-medium">{eventDate}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Hora</p>
              <p className="font-medium">{eventTime}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Lugares</p>
              <p className="font-medium">{seats}</p>
            </div>
          </div>

          {/* Perforation Effect */}
          <div className="relative my-6">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-400"></div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center mt-10">
            <QRCodeGenerator
              url={event?.qrCode || "https://example.com"}
              className="h-32 w-32 bg-white p-2 rounded"
            />
            <div className="mt-4 text-center text-sm">
              <p className="font-semibold">
                Bilhete do evento {new Date().getFullYear()}
              </p>
              {event?.tiketType?.name && (
                <p className="text-gray-400">
                  {event.tiketType.name}: MZN {event.tiketType.price || "0"}
                </p>
              )}
              <p className="mt-2 text-gray-500">ID: {event?.id || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <section className="w-full flex justify-center gap-5 mt-5 px-3">
        <Button
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="mr-2" />
          {isDownloading ? "Preparando..." : "Baixar meu bilhete"}
        </Button>
      </section>
    </main>
  );
}
