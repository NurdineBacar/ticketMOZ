import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Music,
  Ticket,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { useLanguage } from '@/contexts/LanguageContext';
import PaymentDialog from "./PaymentDialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/hook-langauge";
import { userAgent } from "@/consts/users";
import { EventProps } from "@/app/localEvent";

interface EventDetailsDialogProps {
  event: EventProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  event,
  open,
  onOpenChange,
}) => {
  const [normalCount, setNormalCount] = useState(1);
  const [vipCount, setVipCount] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  // const { user } = useAuth();
  const user = userAgent;
  // const navigate = useNavigate();
  const router = useRouter();
  // const { t, language } = useLanguage();
  const t = useTranslation();

  // Check if event has VIP tickets available (mocked here, would come from API in real app)
  const hasVipTickets = true; // For demo purposes, assuming all events have VIP tickets

  // Convert price to MZN if not already
  const formatPrice = (price: string) => {
    if (price.includes("R$")) {
      // Extract number from R$ format and convert to MZN
      const numericPrice = Number(price.replace(/[^0-9]/g, ""));
      return `${numericPrice} ${t("currency")}`;
    }
    return price;
  };

  // Calculate base price from the string (e.g., "150 MZN" -> 150)
  const basePrice = event.event?.ticket.ticketType[1].price ?? 0;
  const vipPrice = event.event?.ticket.ticketType[0]?.price ?? 0;

  const totalNormalPrice = basePrice * normalCount;
  const totalVipPrice = vipPrice * vipCount;
  const totalPrice = totalNormalPrice + totalVipPrice;

  const handleDecrement = (type: "normal" | "vip") => {
    if (type === "normal") {
      setNormalCount((prev) => Math.max(0, prev - 1));
    } else {
      setVipCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleIncrement = (type: "normal" | "vip") => {
    if (type === "normal") {
      setNormalCount((prev) => prev + 1);
    } else {
      setVipCount((prev) => prev + 1);
    }
  };

  const handleProceedToPayment = () => {
    if (normalCount === 0 && vipCount === 0) {
      toast.error(t("selectAtLeastOneTicket"));
      return;
    }
    setPaymentOpen(true);
  };

  const handlePurchase = () => {
    console.log("NOrmal: " + normalCount);
    console.log("Normal price: " + basePrice);
    console.log("VIP: " + vipCount);
    console.log("VIP PRice: " + vipPrice);
    console.log(event.event);

    // if (!user) {
    //   // Redirect to login with return path info
    //   router.push(`${!user ? "/login" : "/lading/" + event.id}`);
    //   return;
    // }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto w-[95%] mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {event.title}
            </DialogTitle>
            <DialogDescription>{t("eventDetails")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="relative h-48 sm:h-60 w-full overflow-hidden rounded-md">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-xs">
                {event.genre}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span className="font-medium">{event.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <Music size={20} />
                <span>{event.genre}</span>
              </div>

              <div className="flex items-center">
                <p className="text-justify font-medium first-letter:capitalize">
                  {event.event?.description}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <h3 className="font-bold text-lg">{t("selectTickets")}:</h3>

              {/* Normal Ticket Selection - Always available */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium">{t("normalTicket")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("standardEntry")}
                    </p>
                  </div>
                  <div className="font-bold">
                    {formatPrice(
                      event.event?.ticket.ticketType[1].price.toString() ?? ""
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="mr-4">{t("quantity")}:</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDecrement("normal")}
                      disabled={normalCount <= 0}
                    >
                      <MinusCircle />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {normalCount}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleIncrement("normal")}
                    >
                      <PlusCircle />
                    </Button>
                  </div>
                </div>
              </div>

              {/* VIP Ticket Selection - Only show if available */}
              {vipPrice > 0 && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-medium">{t("vipTicket")}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t("premiumAccess")}
                      </p>
                    </div>
                    <div className="font-bold">
                      {`${vipPrice.toFixed(0)} ${t("currency")}`}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="mr-4">{t("quantity")}:</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDecrement("vip")}
                        disabled={vipCount <= 0}
                      >
                        <MinusCircle />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {vipCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleIncrement("vip")}
                      >
                        <PlusCircle />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">{t("orderSummary")}:</h3>
              <div className="space-y-2 mb-4">
                {normalCount > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {normalCount}x {t("normalTicket")}
                    </span>
                    <span>
                      {totalNormalPrice} {t("currency")}
                    </span>
                  </div>
                )}
                {hasVipTickets && vipCount > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {vipCount}x {t("vipTicket")}
                    </span>
                    <span>
                      {totalVipPrice} {t("currency")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>{t("total")}</span>
                  <span>
                    {totalPrice} {t("currency")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleProceedToPayment}
              className="w-full"
              size="lg"
              disabled={normalCount === 0 && vipCount === 0}
            >
              <Ticket className="mr-2 h-5 w-5" />
              {t("continueToPayment")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        event={event}
        normalCount={normalCount}
        vipCount={vipCount}
        totalPrice={totalPrice}
      />
    </>
  );
};

export default EventDetailsDialog;
