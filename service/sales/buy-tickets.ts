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
        eventId: data.eventId, // Corrigido para eventId
        payment_method: data.payment_method,
        phone_number_payment: data.phone_number_payment,
        user_id: data.user_id, // Corrigido para user_id
        ticketID: data.event?.ticket.id, // Garantir que isso está definido
      };

      const resp = await api.post("/ticket/buy-ticket", { data: payload });

      if (resp.status === 200 || resp.status === 201) {
        return resp.data;
      }

      throw new Error(resp.data || "Erro ao processar a requisição");
    } catch (error) {
      console.log("Erro: ");
      console.log(error);
      console.log("Payload: ");
      console.log(data);
    }
  }
}
