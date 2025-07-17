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

// ... (your existing imports and component structure)

export default function DetailsEvent() {
  const param = useParams();
  const eventId = param.id as string | undefined;
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const ticketService = new TicketService();
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ticketRef.current) {
      toast.error("Não foi possível encontrar o bilhete para download.");
      return;
    }

    toast.info("A preparar o seu bilhete para download...");

    try {
      // It's good to have a small delay, but ensure it's sufficient for all content.
      // For more robust solutions, consider a state-based approach where you only
      // allow download after all data/images are confirmed loaded.
      await new Promise((resolve) => setTimeout(resolve, 500)); // Increased delay slightly

      // Ensure images inside the ticket container are loaded
      const images = ticketRef.current.querySelectorAll("img");
      const imageLoadPromises = Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      });
      await Promise.all(imageLoadPromises);

      const dataUrl = await toPng(ticketRef.current, {
        quality: 1,
        backgroundColor: "white",
        pixelRatio: 4, // Further increase pixelRatio for very high quality
        cacheBust: true,
        // Remove style transformations here unless you specifically need to override
        // existing CSS transformations that might distort the image.
        // It's generally better to ensure the element is correctly styled *before* capture.
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4", // Specify A4 format for clarity
      });

      const img = new Image();
      img.src = dataUrl;

      // Use a promise to ensure the image is loaded before adding to PDF
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imgWidth = img.width;
      const imgHeight = img.height;

      const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // A4 width minus 10mm margins on each side
      const pdfHeight = pdf.internal.pageSize.getHeight() - 20; // A4 height minus 10mm margins on top/bottom

      let ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      // Calculate the dimensions of the image on the PDF page
      const finalImgWidth = imgWidth * ratio;
      const finalImgHeight = imgHeight * ratio;

      // Center the image on the page
      const xOffset = (pdf.internal.pageSize.getWidth() - finalImgWidth) / 2;
      const yOffset = (pdf.internal.pageSize.getHeight() - finalImgHeight) / 2;

      pdf.addImage(
        dataUrl,
        "PNG",
        xOffset,
        yOffset,
        finalImgWidth,
        finalImgHeight
      );

      pdf.save("meu-bilhete.pdf");
      toast.success("Bilhete baixado com sucesso! 🎉");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Ocorreu um erro ao baixar o bilhete. Tente novamente. 😢");
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

  // Formatting date and time might be better done directly where displayed if 'event' structure is inconsistent
  // The provided code already handles this, keeping it for consistency.
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
      {/* Ticket Container com ref para download */}
      <div
        ref={ticketRef}
        id="ticket-container"
        className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200"
      >
        {/* Movie Title Section */}
        <div className="bg-gray-900 text-white p-6 relative h-96">
          <div className="absolute inset-0 opacity-30">
            {/* Make sure the image `src` is always valid or has a fallback. */}
            <img
              src={
                event?.tiketType?.ticket?.event?.image ||
                "https://via.placeholder.com/400x200?text=Event+Image"
              }
              alt="Movie Banner"
              className="w-full h-full object-cover"
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
              <p className="font-medium">
                {event?.tiketType?.ticket?.event?.location || location}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Data</p>
              <p className="font-medium">{eventDate}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Hora</p>
              <p className="font-medium">{eventTime}</p>
            </div>
          </div>

          {/* Perforation Effect (removed commented out divs, they were not doing anything) */}
          <div className="relative my-6">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-400 border-t border-dashed border-gray-600"></div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center mt-10">
            <QRCodeGenerator
              url={event?.qrCode || "https://example.com"} // Ensure QR code URL is valid
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
        >
          <Download className="mr-2" /> Baixar meu bilhete
        </Button>
      </section>
    </main>
  );
}
