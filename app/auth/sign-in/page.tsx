"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/hook-langauge";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const verify = await api.get(`/auth/verify-user/${data.email}`);
      console.log(verify.data);
      if (verify.status == 200 || verify.status == 201) {
        if (verify.data.success == false) {
          toast.error(verify.data.message || "Erro ao verificar utilizador");
          return;
        }
      }

      const response = await api.post("/auth/sign-in", {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200 || response.status === 201) {
        const json = response.data;
        const jwt: any = jwtDecode(json.token);
        signIn(jwt?.user, json);

        const redirect = searchParams.get("redirect");
        if (redirect) {
          router.replace(redirect);
        } else {
          router.replace("/");
        }
        toast.success("Sessão iniciada com sucesso");
      } else {
        toast.error(response.data.message || "Erro ao processar login");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Email ou senha incorretos. Tente novamente.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen auth-container px-4">
      <div className="flex w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/2 bg-gray-100 relative hidden md:block">
          <div className="w-full h-full flex items-center justify-center p-8">
            <img
              src="/assets/Login.svg"
              alt="Login Illustration"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.innerHTML =
                  '<div class="text-center p-8"><h2 class="text-xl font-bold">TicketMOZ</h2><p class="text-muted-foreground">Eficiência e segurança para seus eventos</p></div>';
              }}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <Card className="w-full border-2">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">{t("login")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center flex-wrap-reverse gap-3 md:gap-0 justify-between">
                          <FormLabel htmlFor="password">
                            {t("password")}
                          </FormLabel>
                          <Link
                            href="forgot-password"
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            {t("forgotPassword")}
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-10"
                              {...field}
                              required
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              aria-label={
                                showPassword
                                  ? "Esconder senha"
                                  : "Mostrar senha"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Entrando..." : t("login")}
                  </Button>
                </form>
              </Form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {t("dontHaveAccount")}
                </span>{" "}
                <Link
                  href="/auth/sign-up"
                  className="hover:text-primary font-medium"
                >
                  {t("signup")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
