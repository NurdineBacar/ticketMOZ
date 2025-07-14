import api from "../api";

export class UserService {
  async getAll() {
    try {
      const resp = await api.get(`user/all`);
      if (resp.status == 200 || resp.status == 201) {
        return resp.data.data;
      } else {
        return resp.data.message || "Erro ao buscar evento";
      }
    } catch (error) {
      throw new Error("Erro ao processar requisicao -> " + error);
    }
  }

  async approvePromoter(id: string) {
    try {
      const resp = await api.put(`user/approve-promoter/${id}`);
      return resp.data;
    } catch (error) {
      throw new Error("Erro ao aprovar promotor: " + error);
    }
  }

  async blockUser(id: string) {
    try {
      const resp = await api.put(`user/block/${id}`);
      return resp.data;
    } catch (error) {
      throw new Error("Erro ao bloquear utilizador: " + error);
    }
  }

  async unblockUser(id: string) {
    try {
      const resp = await api.put(`user/unblock/${id}`);
      return resp.data;
    } catch (error) {
      throw new Error("Erro ao desbloquear utilizador: " + error);
    }
  }

  async getPendingPromoters() {
    try {
      const resp = await api.get(`user/pending-promoters`);
      return resp.data.data;
    } catch (error) {
      throw new Error("Erro ao buscar promotores pendentes: " + error);
    }
  }
}
