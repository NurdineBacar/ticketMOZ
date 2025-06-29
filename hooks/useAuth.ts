// hooks/useAuth.js
import { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { loginSuccess, logout } from "@/lib/redux/slices/auth";
import { RootState } from "@/lib/redux/store";
import { LoginData } from "@/types/auth";
import { User } from "@/types/user";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Verificar cookie/token ao carregar
    const token = Cookies.get("authToken");
    const userCookie = Cookies.get("user");
    const userData = userCookie ? JSON.parse(userCookie) : null;

    if (token && userData) {
      dispatch(loginSuccess(userData));
    }
  }, [dispatch]);

  const signIn = async (userData: User, token: string) => {
    // Salvar nos cookies
    Cookies.set("authToken", token);
    Cookies.set("user", JSON.stringify(userData));

    // Atualizar Redux
    dispatch(loginSuccess(userData));
  };

  const signOut = () => {
    // Remover cookies
    Cookies.remove("authToken");
    Cookies.remove("user");

    // Atualizar Redux
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    signIn,
    signOut,
  };
}
