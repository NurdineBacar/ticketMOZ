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
import PaymentDialog from "./PaymentDialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/hook-langauge";
import { EventProps } from "@/app/localEvent";

interface EventDetailsDialogProps {
  event: EventProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess?: () => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  event,
  open,
  onOpenChange,
  onPaymentSuccess,
}) => {
  const [normalCount, setNormalCount] = useState(1);
  const [vipCount, setVipCount] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const router = useRouter();
  const t = useTranslation();

  // Safely get ticket prices with fallbacks
  const normalTicket = event.event?.ticket?.ticketType?.find(
    (t) => t.name === "Normal"
  );
  const vipTicket = event.event?.ticket?.ticketType?.find(
    (t) => t.name === "VIP"
  );

  const basePrice = normalTicket?.price ?? 0;
  const vipPrice = vipTicket?.price ?? 0;
  const hasVipTickets = vipPrice > 0;

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

  const formatPrice = (price: number) => {
    return `${price} ${t("currency")}`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto w-[95%] md:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {event.title}
            </DialogTitle>
            <DialogDescription>{t("eventDetails")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {event.imageUrl ? (
              <div className="relative h-[480px] sm:h-[600px] w-full overflow-hidden rounded-md">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
                {event.genre && (
                  <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-xs">
                    {event.genre}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 sm:h-[600px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                No image available
              </div>
            )}

            <div className="flex items-center gap-8 flex-wrap">
              {event.date && (
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span className="font-medium">{event.date}</span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span>{event.location}</span>
                </div>
              )}

              {event.genre && (
                <div className="flex items-center gap-2">
                  <Music size={20} />
                  <span>{event.genre}</span>
                </div>
              )}
            </div>

            {event.event?.description && (
              <div className="flex items-center">
                <p className="text-justify font-normal first-letter:capitalize">
                  {event.event.description}
                </p>
              </div>
            )}

            <div className="space-y-2 border-t pt-4">
              <h3 className="font-bold text-lg">{t("selectTickets")}:</h3>

              {/* Normal Ticket Selection */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium">{t("normalTicket")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("standardEntry")}
                    </p>
                  </div>
                  <div className="font-bold">{formatPrice(basePrice)}</div>
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
              {hasVipTickets && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-medium">{t("vipTicket")}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t("premiumAccess")}
                      </p>
                    </div>
                    <div className="font-bold">{formatPrice(vipPrice)}</div>
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
                    <span>{formatPrice(totalNormalPrice)}</span>
                  </div>
                )}
                {hasVipTickets && vipCount > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {vipCount}x {t("vipTicket")}
                    </span>
                    <span>{formatPrice(totalVipPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>{t("total")}</span>
                  <span>{formatPrice(totalPrice)}</span>
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

      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        event={event}
        normalCount={normalCount}
        vipCount={vipCount}
        totalPrice={totalPrice}
        onPaymentSuccess={onPaymentSuccess}
      />
    </>
  );
};

export default EventDetailsDialog;
