"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { Ticket, Loader2, LogIn, RefreshCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AutoRegiste() {
  const param = useParams().token;

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (!param) {
        return "Token invalido";
      }

      const jwt: any = jwtDecode(param as string);
      const data = jwt.user;

      console.log("Dados descriptografados: ");
      console.log(data);

      const response = await api.post("/user/create", {
        name: data.name,
        email: data.email,
        user_type: data.user_type,
        password: data.password,
        company: {
          name: data?.company?.name,
          email: data?.company?.email,
          phone_number: data?.company?.phone_number,
          nuit: data?.company?.nuit,
        },
      });

      const json = response.data;
      if (!json.success) {
        setSuccess(false);
        setLoading(false);
        toast.error(json.message ?? "Erro");
        return;
      } else {
        setSuccess(true);
        setLoading(false);

        toast.success("Utilizador cadastrado com sucesso!");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.replace("/auth/sign-in");
  };

  useEffect(() => {
    if (!param) return;

    onSubmit();
  }, [param]);

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-96 py-8 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold justify-center">
            <Ticket className="text-primary" size={32} />
            <span className="mb-1">TicketMOZ</span>
          </CardTitle>
          <CardDescription className="text-center">
            Estamos a criar a sua conta no sistema TicketMOZ
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center gap-3">
          {loading == true ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground text-center mt-3">
                Por favor, aguarde enquanto configuramos seu acesso...
              </span>
            </div>
          ) : (
            <div>
              {success ? (
                <Button onClick={handleSignIn}>
                  <LogIn /> Inciar Sessao
                </Button>
              ) : (
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-semibold text-muted-foreground text-center mb-2">
                    Ocorreu um erro ao tentar cadastra
                  </span>
                  <Button onClick={onSubmit}>
                    <RefreshCcw /> Tentar novamente
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
