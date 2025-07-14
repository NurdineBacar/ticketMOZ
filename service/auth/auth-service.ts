import api from "../api";

export class AuthService {
  async verifyUser(email: string): Promise<boolean> {
    try {
      const resp = await api.post("auth/verify-user", { email });
      return resp.data?.success || false;
    } catch (error) {
      console.error("Verify user error:", error);
      return false;
    }
  }

  async sendMailUser(
    email: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const resp = await api.post("auth/mail-user", { email });
      return {
        success: resp.data?.success || false,
        message: resp.data?.message,
      };
    } catch (error) {
      console.error("Send mail error:", error);
      return { success: false, message: "Failed to send recovery email" };
    }
  }

  async resetPassword(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const resp = await api.post("auth/reset-password", {
        email: email,
        password: password,
      });
      return {
        success: resp.data?.success || false,
        message: resp.data?.message,
      };
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      return { success: false, message: "Erro ao resetar senha" };
    }
  }
}
