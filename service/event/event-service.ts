import api from "../api";

export class EventService {
  async getEvents() {
    try {
      const response = await api.get("/event");
      if (response.status === 200) {
        return response.data.data; // Retorna apenas os dados diretamente
      }
      throw new Error(response.data.message || "Erro ao buscar eventos");
    } catch (error) {
      console.error("Erro no EventService:", error);
      throw error; // Rejeita o erro para ser tratado no componente
    }
  }

  async getEventsDash(userID: string): Promise<any> {
    try {
      const resp = await api.get(`/event/dash/${userID}`);
      if (resp.status == 200 || resp.status == 201) {
        return resp.data;
      }
    } catch (error) {
      throw new Error(error + "");
    }
  }

  async getEventsPromoter(userID: string): Promise<any> {
    try {
      const resp = await api.get(`/event/by-promoter/${userID}`);
      if (resp.status == 200 || resp.status == 201) {
        return resp.data;
      }
    } catch (error) {
      throw new Error(error + "");
    }
  }

  async createEvent(eventData: any) {
    try {
      const response = await api.post("/event/create", eventData);
      if (response.status === 201) {
        return response.data; // Retorna os dados do evento criado
      }
      throw new Error(response.data.message || "Erro ao criar evento");
    } catch (error) {
      console.error("Erro no EventService:", error);
      throw error; // Rejeita o erro para ser tratado no componente
    }
  }

  async updateEvent(eventData: any) {
    try {
      const response = await api.put(
        `/event/update/${eventData?.id}`,
        eventData
      );
      if (response.status === 201) {
        return response.data; // Retorna os dados do evento criado
      }
      throw new Error(response.data.message || "Erro ao criar evento");
    } catch (error) {
      console.error("Erro no EventService:", error);
      throw error; // Rejeita o erro para ser tratado no componente
    }
  }

  async getEventById(id: string) {
    try {
      const resp = await api.get(`/event/${id}`);
      if (resp.status === 200) {
        return resp.data.data;
      }
      throw new Error(resp.data.message || "Erro ao buscar eventos");
    } catch (error) {
      console.error("Erro no EventService:", error);
      throw error; // Rejeita o erro para ser tratado no componente
    }
  }

  async delete(id: string) {
    try {
      const resp = await api.delete(`/event/delete-event/${id}`);
      if (resp.status === 200) {
        return resp.data.data;
      }
      throw new Error(resp.data.message || "Erro ao buscar eventos");
    } catch (error) {
      console.error("Erro no EventService:", error);
      throw error; // Rejeita o erro para ser tratado no componente
    }
  }

  async inviteScanner(eventID: string, scanners: number) {
    try {
      const resp = await api.post("invite-scanner/create", {
        eventID: eventID,
        total_scanner: scanners,
      });

      if (resp.status === 200 || resp.status === 201) {
        return resp.data.data;
      }

      throw new Error(resp.data.message || "Erro ao cirar evento");
    } catch (error) {
      throw new Error("Erro ao processar requisicao -> " + error);
    }
  }

  async acceptInviteScanner(token: string, userID: string) {
    try {
      const resp = await api.post("invite-scanner/accept/" + token, {
        userID: userID,
      });

      if (resp.status != 400) {
        return resp.data.data;
      } else {
        return resp.data.message || "Erro ao aceitar o convite";
      }
    } catch (error) {}
  }

  async getEventByToken(token: string) {
    try {
      const resp = await api.get(`/event/by-token/${token}`);
      if (resp.status == 200 || resp.status == 201) {
        return resp.data.data;
      } else {
        return resp.data.message || "Erro ao buscar evento";
      }
    } catch (error) {
      throw new Error("Erro ao processar requisicao -> " + error);
    }
  }

  async getScannerByEvetn(eventID: string) {
    try {
      const resp = await api.get(`event/fetch-all-scanners/${eventID}`);
      if (resp.status == 200 || resp.status == 201) {
        return resp.data.data;
      } else {
        return resp.data.message || "Erro ao buscar evento";
      }
    } catch (error) {
      throw new Error("Erro ao processar requisicao -> " + error);
    }
  }
}
