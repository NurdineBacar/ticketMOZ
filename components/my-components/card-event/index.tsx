import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Music, Banknote, Ticket } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/hook-langauge";
import { useRouter } from "next/navigation";
import { EventProps } from "@/app/localEvent";
import EventDetailsDialog from "../EventDetailsDialog";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

const CardEvent: React.FC<{ event: EventProps }> = ({ event }) => {
  const isMobile = useIsMobile();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { user } = useAuth();
  const t = useTranslation();
  const router = useRouter();

  console.log("User do hoook:");
  console.log(user);
  console.log("FIm do user do hook");
  const handleButtonClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // If user is logged in, open details dialog
    setDetailsOpen(true);
  };

  const teste = async () => {
    try {
      await api.post(
        "http://localhost:4000/ticket/pay",
        {
          amount: 15,
          phone_number: "845636664",
        },
        {
          headers: {
            Authorization:
              "Basic cGtfdGVzdF84NzkyMzNiMzgwYjRjMjU3YzAxMzQwNWIyNWNiM2Q5Mzpza190ZXN0XzViODNiZTJlYTlhZTVlZDdiY2ZlZTg2NjI3YmE3YzczMWYzNzVkNzZjY2QxMjI4Ng==",
            "Content-Type": "application/json",
          },
          timeout: 80000,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="relative h-80 sm:h-[410px] overflow-hidden -top-6">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full  transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-xs">
            {event.genre}
          </div>
        </div>
        <CardContent className="flex-grow -mt-6">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
          <div className="space-y-2 text-sm text-gray-600 flex items-start justify-start gap-6">
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
              <span>MZN {event.price}</span>
            </div>
          </div>
        </CardContent>
        {user && (
          <CardFooter className="pt-0 flex flex-col gap-3">
            <Button
              className="w-full"
              size={isMobile ? "lg" : "default"}
              onClick={handleButtonClick}
            >
              <Ticket size={16} className="mr-1" />
              <span>{t("buyButton")}</span>
            </Button>
          </CardFooter>
        )}
      </Card>

      <EventDetailsDialog
        event={event}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onPaymentSuccess={() => setDetailsOpen(false)}
      />
    </>
  );
};

export default CardEvent;
