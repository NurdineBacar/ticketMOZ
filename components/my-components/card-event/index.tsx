import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Music,
  Banknote,
  Ticket,
  Timer,
  Tickets,
  XCircle,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/hook-langauge";
import { useRouter } from "next/navigation";
import { EventProps } from "@/app/localEvent";
import EventDetailsDialog from "../EventDetailsDialog";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";

const CardEvent: React.FC<{ event: EventProps }> = ({ event }) => {
  const isMobile = useIsMobile();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { user } = useAuth();
  const t = useTranslation();
  const router = useRouter();

  // Check ticket availability
  const normalTicket = event.event?.ticket?.ticketType?.find(
    (t) => t.name === "Normal"
  );
  const vipTicket = event.event?.ticket?.ticketType?.find(
    (t) => t.name === "VIP"
  );

  const normalQuantity = normalTicket?.quantity ?? 0;
  const vipQuantity = vipTicket?.quantity ?? 0;

  // Check if event date has passed or is today
  const eventDate = event.date ? new Date(event.date) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

  const isPastEvent = eventDate && eventDate < today;
  const isToday =
    eventDate &&
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear();

  // Determine if event is available
  const isAvailable =
    (normalQuantity > 0 || vipQuantity > 0) && !isPastEvent && !isToday; // Remove !isToday if you want same-day to be available

  const handleButtonClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAvailable) {
      return; // Don't open dialog if unavailable
    }

    setDetailsOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col relative">
        {/* Unavailable overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-60 z-10 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <XCircle size={48} className="mx-auto mb-2" />
              <h3 className="text-xl font-bold">INDISPONÍVEL</h3>
              <p className="text-sm mt-1">
                {isPastEvent
                  ? "Este evento já ocorreu"
                  : isToday
                  ? "Evento ocorre hoje"
                  : "Ingressos esgotados"}
              </p>
            </div>
          </div>
        )}

        <div className="relative h-[480px] sm:h-[410px] overflow-hidden -top-6">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-xs">
            {event.genre}
          </div>
        </div>

        <CardContent className="flex-grow flex-col -mt-6">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
          <div className="space-y-2 text-sm text-gray-600 flex items-start justify-start flex-wrap gap-x-3 gap-y-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer size={16} />
              <span className="line-clamp-1">{event.event?.start_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tickets size={16} /> Qtd:
              <span className="line-clamp-1">{normalQuantity} - Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <Tickets size={16} /> Qtd:
              <span className="line-clamp-1">{vipQuantity} - VIP</span>
            </div>

            {vipTicket?.price && vipTicket.price > 0 && (
              <div className="flex items-center gap-2">
                <Banknote size={16} />
                <span>MZN {vipTicket.price} - VIP</span>
              </div>
            )}

            {normalTicket?.price && normalTicket.price > 0 && (
              <div className="flex items-center gap-2">
                <Banknote size={16} />
                <span>MZN {normalTicket.price} - Normal</span>
              </div>
            )}
          </div>
        </CardContent>

        {user &&
          user.user_type != "promotor" &&
          user.user_type != "master-admin" && (
            <CardFooter className="pt-0 flex flex-col gap-3">
              <Button
                className="w-full"
                size={isMobile ? "lg" : "default"}
                onClick={handleButtonClick}
                disabled={!isAvailable}
              >
                {isAvailable ? (
                  <>
                    <Ticket size={16} className="mr-1" />
                    <span>{t("buyButton")}</span>
                  </>
                ) : (
                  <span>INDISPONÍVEL</span>
                )}
              </Button>
            </CardFooter>
          )}
      </Card>

      {isAvailable && (
        <EventDetailsDialog
          event={event}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          onPaymentSuccess={() => setDetailsOpen(false)}
        />
      )}
    </>
  );
};

export default CardEvent;
