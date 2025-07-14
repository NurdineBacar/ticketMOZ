"use client";
import QRCodeGenerator from "@/components/my-components/qrdcode";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EventService } from "@/service/event/event-service";
import { SalesTicketService } from "@/service/sales/sales-ticket";
import { TicketService } from "@/service/tickets/ticket-service";
import { Download } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DetailsEvent() {
  const param = useParams();
  const eventId = param.id as string | undefined;
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const ticketService = new TicketService();

  const handleDownload = async () => {
    const header = document.getElementById("ticket-header");
    if (!header) {
      toast.error(
        "Não foi possível encontrar o cabeçalho do bilhete para download."
      );
      return;
    }

    toast.info("A preparar o seu bilhete para download...");

    try {
      // Get the actual computed dimensions of the header
      const headerRect = header.getBoundingClientRect();
      const headerWidth = headerRect.width;
      const headerHeight = headerRect.height;

      // Use domtoimage.toPng to convert the DOM node to a PNG data URL
      // Ensure that the image generated has the same aspect ratio as the header
      const imgData = await domtoimage.toPng(header, {
        quality: 1, // Max quality
        bgcolor: "#ffffff", // Explicitly set a background color to prevent transparency issues
        width: headerWidth, // Ensure the image has the exact width of the header
        height: headerHeight,
        // Ensure the image has the exact height of the header
        style: {
          // You can add styles here if needed to make sure dom-to-image captures correctly
          // For example, if there's any overflow you want to hide during capture:
          // overflow: 'hidden',
          // boxSizing: 'border-box' // Important for consistent width/height calculations
        },
      });

      // Create a new jsPDF instance
      // Set the format to be exactly the dimensions of the header in 'px' unit
      // This makes the PDF page size precisely match the captured image
      const pdf = new jsPDF({
        orientation: "landscape", // Set to landscape
        unit: "px", // Use pixels for unit to match DOM measurements
        format: [headerWidth, headerHeight], // Set PDF page format to header's dimensions
      });

      // Add the image to the PDF
      // Place the image at (0,0) and make it fill the entire PDF page
      pdf.addImage(imgData, "PNG", 0, 0, headerWidth, headerHeight);

      pdf.save("meu-bilhete.pdf");
      toast.success("Bilhete baixado com sucesso!");
    } catch (error) {
      console.error("Error generating PDF with dom-to-image:", error);
      toast.error("Ocorreu um erro ao baixar o bilhete. Tente novamente.");
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

  return (
    <main className={cn("w-full pt-4 mt-[17vh]", loading ? "" : "px-5   ")}>
      <header
        id="ticket-header"
        className={cn(
          "flex flex-col md:flex-row w-full max-w-7xl mx-auto rounded md:rounded-2xl p-3"
        )}
      >
        {/* Seção esquerda: Imagem e conteúdo */}
        <div className="w-full md:w-4/5 h-44 md:h-72 flex bg-white relative rounded-xl shadow border">
          {/* Imagem de fundo */}
          <div className="w-2/5 h-full rounded-tl-2xl rounded-bl-2xl overflow-hidden">
            <img
              src={event?.tiketType?.ticket?.event?.image}
              alt="Event banner"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Conteúdo do ingresso */}
          <div className="w-2/3 p-6 flex flex-col justify-between text-gray-800">
            <div className="mt-1 md:mt-3 flex items-start gap-10">
              <section>
                <h2 className="md:text-4xl font-bold">
                  {event?.tiketType?.ticket?.event?.title || "Título do Evento"}
                </h2>
                <div className="mt-2 md:mt-7">
                  <p className="text-xs md:text-sm mt-1">
                    <strong className="text-xs md:text-base">Date:</strong>{" "}
                    {event?.tiketType?.ticket?.event?.event_date || "N/A"}
                    &nbsp;&nbsp;
                    <strong className="text-xs md:text-base">Time:</strong>{" "}
                    {event?.tiketType?.ticket?.event?.start_time || "N/A"}
                  </p>
                  <p className="text-xs md:text-sm mt-1">
                    <strong>Address:</strong>{" "}
                    {event?.tiketType?.ticket?.event?.location ||
                      "Local não especificado"}
                  </p>
                </div>
              </section>
            </div>

            <div className="flex gap-2 mt-1 md:mt-4">
              <span className="uppercase bg-black text-white text-[9px] md:text-sm px-1 py-0.5 md:px-3 md:py-1 rounded-full">
                {event?.tiketType?.ticket?.event?.company?.name ||
                  "Organizador"}
              </span>
            </div>

            <div className="absolute md:top-4 top-3 md:left-4 left-1 bg-black capitalize text-white text-[9px] md:text-sm md:px-3 px-1 md:py-1 py-0.5 rounded-full shadow-md">
              {event?.isUsed ? "Usado" : "Não usado"}
            </div>
          </div>
        </div>

        {/* Seção direita: QRCode e ID */}
        <div className="w-full md:w-1/5 bg-black h-44 md:h-72 text-white flex md:flex-col items-center justify-center gap-4 p-4 relative rounded-xl">
          <QRCodeGenerator
            url={event?.qrCode || "https://example.com"}
            className="h-32 w-32 md:h-40 md:w-40 bg-white p-2 rounded"
          />
          <div className="text-xs text-center">
            <p className="font-semibold">Bilhete do evento 2025</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              {event?.tiketType?.name && (
                <p className="font-medium">
                  {event.tiketType.name}: MZN {event.tiketType.price || "0"}
                </p>
              )}
            </div>
            <p className="mt-3 text-gray-300 font-semibold">
              ID: {event?.id || "N/A"}
            </p>
          </div>
        </div>
      </header>

      <section className="w-full flex justify-center gap-5 mt-5 px-3">
        <Button className="w-full md:w-auto" onClick={handleDownload}>
          <Download className="mr-2" /> Baixar meu bilhete
        </Button>
      </section>
    </main>
  );
}
