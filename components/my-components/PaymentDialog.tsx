import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Check, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/hook-langauge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { EventProps } from "@/app/localEvent";
import { TicketService } from "@/service/tickets/ticket-service";
import { BuyTickets } from "@/service/sales/buy-tickets";
import { User as UserType } from "@/types/user";
import Cookies from "js-cookie";
// import { jsPDF } from "jspdf";
// import QRCode from "qrcode";

interface PaymentDialogProps {
  event: EventProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  normalCount: number;
  vipCount: number;
  totalPrice: number;
  onPaymentSuccess?: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  event,
  open,
  onOpenChange,
  normalCount,
  vipCount,
  totalPrice,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ticketData, setTicketData] = useState<null | {
    ticketId: string;
    customerName: string;
    paymentMethod: string;
    timestamp: string;
  }>(null);
  const t = useTranslation();
  const buyTicketService = new BuyTickets();
  const [user, setUser] = useState<UserType | null>(null);

  // const handlePayment = async () => {
  //   if (!phoneNumber.trim()) {
  //     alert("Por favor, insira um número de telefone válido");
  //     toast.error(
  //       t("enterPhoneNumber") ||
  //         "Por favor, insira um número de telefone válido"
  //     );
  //     return;
  //   }

  //   // Phone validation (basic Mozambique mobile format)
  //   const phonePattern = /^(84|85)[0-9]{7}$/;
  //   if (!phonePattern.test(phoneNumber)) {
  //     toast.error(
  //       t("invalidPhoneFormat") ||
  //         "Formato de número inválido. Use formato: 84/85 seguido de 7 dígitos"
  //     );
  //     return;
  //   }

  //   // Simulate payment processing
  //   setIsProcessing(true);

  //   const resp = await buyTicketService.buyTiket({
  //     qtd_normal: normalCount,
  //     qtd_vip: vipCount,
  //     total: totalPrice,
  //     eventId: event.id + "",
  //     payment_method: paymentMethod,
  //     phone_number_payment: phoneNumber,
  //     user_id: user?.id ?? "",
  //   });

  //   // const resp = await buyTicketService.payAlternative({
  //   //   total: totalPrice,
  //   //   phone_number_payment: phoneNumber,
  //   //   userID: user?.id ?? "",
  //   // });

  //   // verificacao
  //   if (resp.success) {
  //     setIsProcessing(false);
  //     setPhoneNumber(""); // Resetar campo telefone
  //     setShowConfirmation(true); // Abre o dialog de sucesso

  //     // Fecha dialogs após alguns segundos (opcional)
  //     setTimeout(() => {
  //       setShowConfirmation(false);
  //       onOpenChange(false);
  //       if (onPaymentSuccess) onPaymentSuccess();
  //     }, 4000);
  //   } else {
  //     toast.error("Erro!!", {
  //       description: resp.message || "Erro no servidor",
  //     });
  //     setIsProcessing(false);
  //     console.log(resp);
  //   }

  //   console.log(resp);
  // };
  const handlePayment = async () => {
    if (!phoneNumber.trim()) {
      alert("Por favor, insira um número de telefone válido");
      toast.error(
        t("enterPhoneNumber") ||
          "Por favor, insira um número de telefone válido"
      );
      return;
    }

    // Phone validation (basic Mozambique mobile format)
    const phonePattern = /^(84|85)[0-9]{7}$/;
    if (!phonePattern.test(phoneNumber)) {
      toast.error(
        t("invalidPhoneFormat") ||
          "Formato de número inválido. Use formato: 84/85 seguido de 7 dígitos"
      );
      return;
    }

    // Simulate payment processing
    setIsProcessing(true);

    const resp = await buyTicketService.buyTiket({
      qtd_normal: normalCount,
      qtd_vip: vipCount,
      total: totalPrice,
      eventId: event.id + "",
      payment_method: paymentMethod,
      phone_number_payment: phoneNumber,
      user_id: user?.id ?? "",
    });

    // const resp = await buyTicketService.payAlternative({
    //   total: totalPrice,
    //   phone_number_payment: phoneNumber,
    //   userID: user?.id ?? "",
    // });

    // verificacao
    if (resp.success) {
      setIsProcessing(false);
      setPhoneNumber(""); // Resetar campo telefone
      setShowConfirmation(true); // Abre o dialog de sucesso

      // Fecha dialogs após alguns segundos (opcional)
      setTimeout(() => {
        setShowConfirmation(false);
        onOpenChange(false);
        if (onPaymentSuccess) onPaymentSuccess();
      }, 4000);
    } else {
      toast.error("Erro!!", {
        description: resp.message || "Erro no servidor",
      });
      setIsProcessing(false);
      console.log(resp);
    }

    console.log(resp);
  };

  const paymentmethod1 = async () => {
    if (!user) return;
    try {
      const body = {
        amount: totalPrice,
        currency: "MZN",
        customerId: user.id,
        method: {
          type: "MPESA",
          phone: `258${phoneNumber}`,
        },
      };

      const response = await fetch("http://64.23.143.176:8090/api/payments", {
        method: "POST",
        headers: {
          "X-API-KEY": "6wSvVzZec9Ba465pwcu_w9SvdILbFsJgbF7gjoHUWhA",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log("Response:", response);
      if (response.ok) {
        // Aqui você pode processar a resposta da API
        const data = await response.json();
        const id = data.id;
        console.log("Dados recebidos:", data);
        console.log("ID recebido:", id);
        console.log("ID enviado para confirmpayment:", id);

        toast.success("Sucesso!!!");
      } else {
        const errorText = await response.text();
        console.error("Erro da API:", errorText);
        toast.error(response.status);
      }
    } catch (error) {
      toast.error(`Erro ao enviar requisição: ${String(error)}`);
    }
  };

  const confirmpayment = async (id: string) => {
    console.log("ID recebido:", id);
    try {
      const response = await fetch(
        `http://64.23.143.176:8090/api/payments/${id}/confirm`,
        {
          method: "POST",
          headers: {
            "X-API-KEY": "6wSvVzZec9Ba465pwcu_w9SvdILbFsJgbF7gjoHUWhA",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Dados recebidos:", data);

        toast.success("Sucesso!!! Transação enviada com sucesso");
        return;
      } else {
        const errorText = await response.text();
        console.error("Erro da API:", errorText);

        toast.error(`Falha!!! Erro na transação: ${response.status}`);
      }
    } catch (error) {
      toast.error(`Erro!!! Erro ao enviar requisição: ${String(error)}`);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    onOpenChange(false);
    if (onPaymentSuccess) onPaymentSuccess();
  };

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        console.log("User from cookie:", parsedUser);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  }, []);

  // Trigger automatic PDF download when confirmation modal is shown
  useEffect(() => {
    if (showConfirmation && ticketData) {
      // Small delay to ensure modal is visible first
      const timer = setTimeout(() => {
        // generateTicketPDF();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [showConfirmation, ticketData]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(value) => !isProcessing && onOpenChange(value)}
      >
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>{t("payment")}</DialogTitle>
            <DialogDescription>
              {t("enterYourPhoneNumber") ||
                "Insira seu número de telefone para prosseguir com o pagamento"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col md:flex-row overflow-auto">
            {/* Left side: Order Summary */}
            <div className="p-6 flex-1 border-r-0 md:border-r border-border">
              <div className="bg-muted p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">{t("orderSummary")}:</h3>
                <div className="space-y-1 mb-3">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.date} • {event.location}
                  </p>
                </div>
                <div className="space-y-1">
                  {normalCount > 0 && (
                    <p>
                      {normalCount}x {t("normalTicket")}
                    </p>
                  )}
                  {vipCount > 0 && (
                    <p>
                      {vipCount}x {t("vipTicket")}
                    </p>
                  )}
                  <p className="font-bold pt-2 border-t mt-2">
                    {t("totalPrice")}: {totalPrice.toFixed(0)} {t("currency")}
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-md border text-sm">
                <p>
                  {t("afterPaymentConfirmation") ||
                    "Após a confirmação do pagamento"}
                  :
                </p>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>
                    {t("smsConfirmation") ||
                      "Você receberá um SMS de confirmação"}
                  </li>
                  <li>
                    {t("emailTickets") ||
                      "Os ingressos serão enviados para seu email"}
                  </li>
                  <li>
                    {t("accountAccess") ||
                      "Você pode acessar seus ingressos em sua conta"}
                  </li>
                </ul>
              </div>
            </div>

            {/* Right side: Payment Method */}
            <div className="p-6 flex-1">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="payment-method">{t("paymentMethod")}</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue
                        placeholder={
                          t("choosePaymentMethod") ||
                          "Escolha um método de pagamento"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "mpesa" && (
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">{t("phoneNumber")}</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-muted border rounded-l-md border-r-0">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">+258</span>
                      </div>
                      <Input
                        id="phone-number"
                        placeholder="84/85 xxxxxxx"
                        className="rounded-l-none"
                        value={phoneNumber}
                        onChange={(e) => {
                          // Only allow numbers and limit to 9 digits (84/85 + 7 digits)
                          const value = e.target.value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 9);
                          setPhoneNumber(value);
                        }}
                        inputMode="numeric"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("phoneNumberFormat") ||
                        "Formato: 84/85 seguido por 7 dígitos"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("processingPayment") || "Processando pagamento..."}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  {t("confirmAndPay") || "Confirmar e Pagar"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <AlertDialog open={showConfirmation} onOpenChange={closeConfirmation}>
        <AlertDialogContent className="max-w-md flex flex-col items-center justify-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <AlertDialogHeader className="text-center w-full">
            <AlertDialogTitle className="text-xl w-full text-center">
              {t("paymentSuccessful") || "Pagamento concluído com sucesso!"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center w-full">
              {t("ticketAvailable") ||
                "Seus bilhetes foram enviados para o seu email."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 text-center w-full">
            <p className="text-sm text-muted-foreground mb-6">
              Verifique seu email para acessar os links dos bilhetes e poder
              baixa-los se desejar.
            </p>
            <Button
              onClick={closeConfirmation}
              variant="default"
              className="w-full"
            >
              {t("close") || "Fechar"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PaymentDialog;
