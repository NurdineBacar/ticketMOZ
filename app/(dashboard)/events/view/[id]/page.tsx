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
  useEffect(() => {
    const eventService = new EventService();

    async function fecthEvent() {
      if (typeof eventId === "string") {
        const resp = await eventService.getEventById(eventId);
        setEvent(resp);
        console.log("testttttt", resp);
      } else {
        console.error("Invalid eventId:", eventId);
      }
    }
    fecthEvent();
  });

  return (
    <main className="w-full px-5 pt-4">
      <header className="flex flex-col md:flex-row w-full max-w-7xl mx-auto rounded md:rounded-2xl p-3 ">
        {/* Seção esquerda: Imagem e conteúdo */}
        <div className="w-full md:w-4/5 h-44 md:h-72 flex bg-white relative rounded-xl shadow border">
          {/* Imagem de fundo */}
          <div className="w-2/5 h-full rounded-tl-2xl rounded-bl-2xl overflow-hidden">
            <img
              src={event?.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          {/* Conteúdo do ingresso */}
          <div className="w-2/3 p-6 flex flex-col justify-between text-gray-800">
            <div className="mt-1 md:mt-3 flex items-start gap-10">
              <section>
                <h3 className="text-xs md:text-sm tracking-wide text-gray-400">
                  2025
                </h3>
                <h2 className="md:text-4xl font-bold ">{event?.title}</h2>
                <div className="mt-2 md:mt-7">
                  <p className="text-xs md:text-sm mt-1">
                    <strong className="text-xs md:text-base">Date:</strong>{" "}
                    {event?.event_date} &nbsp;&nbsp;{" "}
                    <strong className="text-xs md:text-base"> Time:</strong>{" "}
                    {event?.start_time} PM
                  </p>
                  <p className="text-xs md:text-sm mt-1">
                    <strong>Address:</strong> {event?.location}
                  </p>
                </div>
              </section>
            </div>

            <div className="flex gap-2 mt-1 md:mt-4">
              <span className="uppercase bg-black text-white text-[9px] md:text-sm px-1 py-0.5  md:px-3 md:py-1 rounded-full">
                {event?.company.name}
              </span>
            </div>

            <div className="absolute md:top-4 top-3 md:left-4 left-1 bg-black  capitalize text-white text-[9px] md:text-sm md:px-3 px-1 md:py-1 py-0.5 rounded-full shadow-md">
              {event?.status}
            </div>
          </div>
        </div>

        {/* Seção direita: QRCode e ID */}
        <div className="w-full md:w-1/5 bg-black h-44 md:h-72 text-white flex md:flex-col items-center justify-center gap-4 p-4 relative rounded-xl">
          <QRCodeGenerator
            url="https://manhuafast.net/manga/apex-future-martial-arts/chapter-230/"
            className="h-32 w-32 md:h-40 md:w-40 bg-white p-2 rounded"
          />
          <div className=" text-xs text-center">
            <p className="font-semibold">Bilhete do evento 2025</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              {event?.ticket?.ticketType &&
                event.ticket.ticketType[0]?.price > 0 && (
                  <p className="font-medium">
                    VIP: MZN {event.ticket.ticketType[0].price}{" "}
                  </p>
                )}
              {event?.ticket?.ticketType &&
                event.ticket.ticketType[1]?.price > 0 && (
                  <p className="font-medium">
                    Normal: MZN {event.ticket.ticketType[1].price}{" "}
                  </p>
                )}
            </div>
            <p className="mt-3 text-gray-300 font-semibold">ID: {event?.id}</p>
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
                <h2 className="font-bold text-3xl">{event?.title}</h2>
              </article>

              <article className="flex flex-col gap-1.5 items-start col-span-2 md:col-span-1">
                <Label className="text-gray-400">POP</Label>
                <h2 className="font-bold">{event?.category}</h2>
              </article>
              <article className="flex flex-col gap-1.5 items-start col-span-2 md:col-span-1 text-xs md:text-base">
                <Label className="text-gray-400">Data</Label>
                <h2 className="font-bold">{event?.event_date}</h2>
              </article>
              <article className="flex flex-col gap-1.5 items-start text-xs md:text-base">
                <Label className="text-gray-400">Horas</Label>
                <div className="flex items-center gap-2">
                  <Label>Inicio: {event?.start_time}</Label>
                  <span>-</span>
                  <Label>Fim: {event?.end_time}</Label>
                </div>
              </article>

              <article className="text-xs md:text-base ">
                <Label className="text-gray-400">Localizacao</Label>
                <h2 className="font-bold">{event?.location}</h2>
              </article>

              <article className="flex flex-col gap-1.5 items-start col-span-2 md:col-span-3 text-xs md:text-base">
                <Label className="text-gray-400">Descricao</Label>
                <h2 className="font-bold">{event?.description}</h2>
              </article>

              {event?.ticket.ticketType &&
                event?.ticket.ticketType[1].price > 0 && (
                  <article className="flex flex-col gap-1.5 items-start text-xs md:text-base">
                    <Label className="text-gray-400">Bilhetes Normais</Label>
                    <div className=" flex items-center gap-5">
                      <h2 className="font-bold">
                        Preco:{" "}
                        {event?.ticket?.ticketType?.find(
                          (t) => t.name === "Normal"
                        )?.price || "N/A"}
                      </h2>
                      <h2 className="font-bold">
                        Quantidade:{" "}
                        {event?.ticket?.ticketType?.find(
                          (t) => t.name === "Normal"
                        )?.quantity || "N/A"}
                      </h2>
                    </div>
                  </article>
                )}

              {event?.ticket.ticketType &&
                event?.ticket.ticketType[0].price > 0 && (
                  <article className="flex flex-col gap-1.5 items-start text-xs md:text-base">
                    <Label className="text-gray-400">Bilhetes VIP's</Label>
                    <div className=" flex items-center gap-5">
                      <h2 className="font-bold">
                        Preco:{" "}
                        {event?.ticket?.ticketType?.find(
                          (t) => t.name === "VIP"
                        )?.price || "N/A"}
                      </h2>
                      <h2 className="font-bold">
                        Quantidade:{" "}
                        {event?.ticket?.ticketType?.find(
                          (t) => t.name === "VIP"
                        )?.quantity || "N/A"}
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
              <img
                src={event?.image}
                className="w-full h-80 rounded-lg object-cover"
                alt=""
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
