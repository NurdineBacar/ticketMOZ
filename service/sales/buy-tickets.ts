import { Event } from "@/types/event";
import api from "../api";
type BuyTicketProps = {
  qtd_normal: number;
  qtd_vip: number;
  total: number;
  eventId: string;
  event?: Event;
  payment_method: string;
  phone_number_payment: string;
  user_id: string;
};

export class BuyTickets {
  async buyTiket(data: BuyTicketProps): Promise<any> {
    try {
      const payload = {
        normal_ticket: data.qtd_normal,
        vip_ticket: data.qtd_vip,
        total: data.total,
        eventId: data.eventId,
        payment_method: data.payment_method,
        phone_number_payment: data.phone_number_payment,
        user_id: data.user_id,
        ticketID: data.event?.ticket.id,
      };

      const payment = await api.post(
        "http://localhost:4000/ticket/pay",
        {
          amount: Number(data.total),
          phone_number: data.phone_number_payment,
        },
        {
          headers: {
            Authorization:
              "Basic cGtfdGVzdF84NzkyMzNiMzgwYjRjMjU3YzAxMzQwNWIyNWNiM2Q5Mzpza190ZXN0XzViODNiZTJlYTlhZTVlZDdiY2ZlZTg2NjI3YmE3YzczMWYzNzVkNzZjY2QxMjI4Ng==",
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      if (payment.data.success) {
        const resp = await api.post("/ticket/buy-ticket", { data: payload });

        if (resp.status === 200 || resp.status === 201) {
          return resp.data;
        }

        return resp.data;
      } else {
        return {
          success: false,
          message: payment.data.message || "Erro interno no servidor",
        };
      }
    } catch (error: any) {
      console.log("Erro: ");
      console.log(error);
      console.log("Payload: ");
      console.log(data);

      // Retorna resposta amigável para o frontend
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Erro interno no servidor. Tente novamente mais tarde.",
      };
    }
  }

  async payAlternative(data: any): Promise<any> {
    const resp = await api.post(
      "/ticket/pay-alternative",
      {
        amount: Number(data.total),
        phone_number: data.phone_number_payment,
        userID: data.userID,
      },
      {
        headers: {
          "X-API-KEY": process.env.NEXT_PUBLIC_X_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (resp.data.success) {
      const confirmPayment = await api.post(
        "/ticket/confirm-alternative",
        {
          paymentID: resp.data.data.id,
        },
        {
          headers: {
            "X-API-KEY": process.env.NEXT_PUBLIC_X_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      return confirmPayment.data;
    }
  }
}
