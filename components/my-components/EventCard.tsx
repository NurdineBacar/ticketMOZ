import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Music, Banknote, Ticket } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import EventDetailsDialog from "./EventDetailsDialog";
import { useTranslation } from "@/hooks/hook-langauge";
import { useRouter } from "next/navigation";
import { EventProps } from "@/app/localEvent";
import { useAuth } from "@/hooks/useAuth";

const EventCard: React.FC<{ event: EventProps }> = ({ event }) => {
  const isMobile = useIsMobile();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const t = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  const handleButtonClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // If user is logged in, open details dialog
    setDetailsOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full  transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-xs">
            {event.genre}
          </div>
        </div>
        <CardContent className="pt-4 flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote size={16} />
              <span>{event.price}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            className="w-full"
            size={isMobile ? "lg" : "default"}
            onClick={handleButtonClick}
          >
            <Ticket size={16} className="mr-1" />
            <span>{t("buyButton")}</span>
          </Button>
        </CardFooter>
      </Card>

      <EventDetailsDialog
        event={event}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
};

export default EventCard;
