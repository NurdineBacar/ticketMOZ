import api from "../api";

export class SalesTicketService {
  async getAll() {
    try {
      const resp = await api.get("/ticket/list-sales");
      if (resp.status === 200 || resp.status === 201) {
        return resp.data;
      }

      throw new Error("Error ao carregar dados -> " + resp.data);
    } catch (error) {
      throw new Error("Erro ao processar requisicao -> " + error);
    }
  }

  async getAllPromoter(userID: string) {
    try {
      const resp = await api.get(`/ticket/list-sales/${userID}`);
      if (resp.status === 200 || resp.status === 201) {
        return resp.data;
      }

      throw new Error("Error ao carregar dados -> " + resp.data);
    } catch (error) {
      throw new Error("Erro ao processar requisicao -> " + error);
    }
  }
}
