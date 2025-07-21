// services/authService.ts
import { LoginData, UserData } from "@/types/auth";
import api, { ApiResponse } from "../api";

interface SignInResult {
  success: boolean;
  message: string;
  data?: UserData;
}

export async function signIn(credentials: LoginData): Promise<SignInResult> {
  try {
    const response = await api.post<ApiResponse<UserData>>(
      "login",
      credentials
    );
    const { data, success, message } = response.data;

    return {
      success,
      message,
      data: success ? data : undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Erro de conexão com o servidor",
    };
  }
}
