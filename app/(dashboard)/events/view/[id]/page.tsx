"use client";
import QRCodeGenerator from "@/components/my-components/qrdcode";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EventService } from "@/service/event/event-service";
import { Event } from "@/types/event";
import { Ticket } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailsEvent() {
  const param = useParams();
  const eventId = param.id as string | undefined;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventService = new EventService();

    async function fetchEvent() {
      if (typeof eventId === "string") {
        try {
          const resp = await eventService.getEventById(eventId);
          setEvent(resp);
        } catch (error) {
          console.error("Error fetching event:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchEvent();
  }, [eventId]); // Added dependency array

  if (loading) {
    return <div className="w-full px-5 pt-4">Loading...</div>;
  }

  if (!event) {
    return <div className="w-full px-5 pt-4">Event not found</div>;
  }

  // Helper function to get ticket info
  const getTicketInfo = (type: "VIP" | "Normal") => {
    return event.ticket?.ticketType?.find((t) => t.name === type) || null;
  };

  const vipTicket = getTicketInfo("VIP");
  const normalTicket = getTicketInfo("Normal");

  return (
    <main className="w-full px-5 pt-4">
      <header className="flex flex-col md:flex-row w-full max-w-7xl mx-auto rounded md:rounded-2xl p-3 ">
        {/* Left section: Image and content */}
        <div className="w-full md:w-4/5 h-44 md:h-72 flex bg-white relative rounded-xl shadow border">
          {/* Background image - only render if image exists */}
          {event.image && (
            <div className="w-2/5 h-full rounded-tl-2xl rounded-bl-2xl overflow-hidden">
              <img
                src={event.image}
                alt={event.title || "Event image"}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Ticket content */}
          <div className="w-2/3 p-6 flex flex-col justify-between text-gray-800">
            <div className="mt-1 md:mt-3 flex items-start gap-10">
              <section>
                <h3 className="text-xs md:text-sm tracking-wide text-gray-400">
                  2025
                </h3>
                <h2 className="md:text-4xl font-bold ">{event.title}</h2>
                <div className="mt-2 md:mt-7">
                  <p className="text-xs md:text-sm mt-1">
                    <strong className="text-xs md:text-base">Date:</strong>{" "}
                    {event.event_date} &nbsp;&nbsp;{" "}
                    <strong className="text-xs md:text-base"> Time:</strong>{" "}
                    {event.start_time} PM
                  </p>
                  <p className="text-xs md:text-sm mt-1">
                    <strong>Address:</strong> {event.location}
                  </p>
                </div>
              </section>
            </div>

            {event.company?.name && (
              <div className="flex gap-2 mt-1 md:mt-4">
                <span className="uppercase bg-black text-white text-[9px] md:text-sm px-1 py-0.5  md:px-3 md:py-1 rounded-full">
                  {event.company.name}
                </span>
              </div>
            )}

            {event.status && (
              <div className="absolute md:top-4 top-3 md:left-4 left-1 bg-black capitalize text-white text-[9px] md:text-sm md:px-3 px-1 md:py-1 py-0.5 rounded-full shadow-md">
                {event.status}
              </div>
            )}
          </div>
        </div>

        {/* Right section: QRCode and ID */}
        <div className="w-full md:w-1/5 bg-black h-44 md:h-72 text-white flex md:flex-col items-center justify-center gap-4 p-4 relative rounded-xl">
          <QRCodeGenerator
            url="https://manhuafast.net/manga/apex-future-martial-arts/chapter-230/"
            className="h-32 w-32 md:h-40 md:w-40 bg-white p-2 rounded"
          />
          <div className="text-xs text-center">
            <p className="font-semibold">Bilhete do evento 2025</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              {vipTicket?.price && (
                <p className="font-medium">VIP: MZN {vipTicket.price}</p>
              )}
              {normalTicket?.price && (
                <p className="font-medium">Normal: MZN {normalTicket.price}</p>
              )}
            </div>
            <p className="mt-3 text-gray-300 font-semibold">ID: {event.id}</p>
          </div>
        </div>
      </header>

      <section className="w-full flex flex-col md:flex-row gap-5 mt-5">
        <Card className="md:w-2/3">
          <CardHeader>
            <CardTitle>Informações do evento</CardTitle>
            <CardDescription>Informação básica do evento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-8">
              <article className="flex flex-col gap-1.5 items-start col-span-2">
                <Label className="text-gray-400">Titulo do evento</Label>
                <h2 className="font-bold text-3xl">{event.title}</h2>
              </article>

              <article className="flex flex-col gap-1.5 items-start col-span-2 md:col-span-1">
                <Label className="text-gray-400">POP</Label>
                <h2 className="font-bold">{event.category}</h2>
              </article>

              <article className="flex flex-col gap-1.5 items-start col-span-2 md:col-span-1 text-xs md:text-base">
                <Label className="text-gray-400">Data</Label>
                <h2 className="font-bold">{event.event_date}</h2>
              </article>

              <article className="flex flex-col gap-1.5 items-start text-xs md:text-base">
                <Label className="text-gray-400">Horas</Label>
                <div className="flex items-center gap-2">
                  <Label>Inicio: {event.start_time}</Label>
                  <span>-</span>
                  <Label>Fim: {event.end_time}</Label>
                </div>
              </article>

              <article className="text-xs md:text-base">
                <Label className="text-gray-400">Localizacao</Label>
                <h2 className="font-bold">{event.location}</h2>
              </article>

              <article className="flex flex-col gap-1.5 items-start col-span-2 md:col-span-3 text-xs md:text-base">
                <Label className="text-gray-400">Descricao</Label>
                <h2 className="font-bold">{event.description}</h2>
              </article>

              {normalTicket && (
                <article className="flex flex-col gap-1.5 items-start text-xs md:text-base">
                  <Label className="text-gray-400">Bilhetes Normais</Label>
                  <div className="flex items-center gap-5">
                    <h2 className="font-bold">
                      Preco: MZN {normalTicket.price}
                    </h2>
                    <h2 className="font-bold">
                      Quantidade: {normalTicket.quantity}
                    </h2>
                  </div>
                </article>
              )}

              {vipTicket && (
                <article className="flex flex-col gap-1.5 items-start text-xs md:text-base">
                  <Label className="text-gray-400">Bilhetes VIP's</Label>
                  <div className="flex items-center gap-5">
                    <h2 className="font-bold">Preco: MZN {vipTicket.price}</h2>
                    <h2 className="font-bold">
                      Quantidade: {vipTicket.quantity}
                    </h2>
                  </div>
                </article>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Imagem do evento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full px-5">
              {event.image ? (
                <img
                  src={event.image}
                  className="w-full h-80 rounded-lg object-cover"
                  alt={event.title || "Event image"}
                />
              ) : (
                <div className="w-full h-80 rounded-lg bg-gray-100 flex items-center justify-center">
                  No image available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
