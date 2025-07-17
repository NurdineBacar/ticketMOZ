import api from "../api";

export class ScannerService {
  async scan(qrcode: string) {
    try {
      const resp = await api.get(`scanner/scan/${qrcode}`);

      if (resp.status == 200 || resp.status == 201) {
        return resp.data;
      } else {
        return resp.data;
      }
    } catch (error) {
      throw new Error("Erro ao processar requisicao -> " + error);
    }
  }

  async verify(qrCode: string) {
    try {
      const resp = await api.get(`scanner/verify/${qrCode}`);

      if (resp.status == 200 || resp.status == 201) {
        return resp.data;
      } else {
        return resp.data.message || "Erro o verificar";
      }
    } catch (error) {
      throw new Error(error + "");
    }
  }

  async getScannedTicket(eventID: string) {
    try {
      const resp = await api.get(`scanner/validated-tickets/${eventID}`);

      if (resp.status == 200 || resp.status == 201) {
        return resp.data;
      } else {
        return resp.data.message || "Erro ao buscar eventos";
      }
    } catch (error) {
      throw new Error(error + "");
    }
  }
}
