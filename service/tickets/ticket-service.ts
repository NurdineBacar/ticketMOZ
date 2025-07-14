import api from "../api";

export class TicketService {
  private tickets: { [id: string]: any } = {};

  createTicket(ticket: any): string {
    const id = this.generateId();
    this.tickets[id] = ticket;
    return id;
  }

  async getAllTicketType(): Promise<any> {
    try {
      const response = await api.get("/ticket/ticket-type");
      if (response.status === 200) {
        return response.data; // Retorna apenas os dados diretamente
      }
      throw new Error(response.data.message || "Erro ao buscar eventos");
    } catch (error) {
      console.error("Erro no EventService:", error);
      throw error; // Rejeita o erro para ser tratado no componente
    }
  }

  updateTicket(id: string, ticket: any): void {
    if (this.tickets[id]) {
      this.tickets[id] = ticket;
    } else {
      throw new Error("Ticket not found");
    }
  }

  deleteTicket(id: string): void {
    if (this.tickets[id]) {
      delete this.tickets[id];
    } else {
      throw new Error("Ticket not found");
    }
  }

  async getSaledTicketById(id: string) {
    try {
      const response = await api.get(`/ticket/saled-ticket/${id}`);
      if (response.status === 200) {
        console.log(response);
        return response.data.data; // Retorna apenas os dados diretamente
      }
      throw new Error(response.data.message || "Erro ao buscar eventos");
    } catch (error) {
      console.error("Erro no EventService:", error);
      throw error; // Rejeita o erro para ser tratado no componente
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
