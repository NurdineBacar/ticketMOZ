"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "@/service/auth/auth-service";

const passwordSchema = z
  .string()
  .min(6, "A senha deve ter pelo menos 6 caracteres")
  .max(8, "A senha deve ter no máximo 8 caracteres")
  .refine((val) => /[A-Z]/.test(val), "Deve conter uma letra maiúscula")
  .refine((val) => /[a-z]/.test(val), "Deve conter uma letra minúscula")
  .refine((val) => /[0-9]/.test(val), "Deve conter um número")
  .refine(
    (val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val),
    "Deve conter um caractere especial"
  );

const resetSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: passwordSchema,
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  const authService = new AuthService();

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { token: token || "", password: "" },
  });

  useEffect(() => {
    if (!token) return;
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded?.email || !decoded?.name) throw new Error();
      setUserData({ name: decoded.name, email: decoded.email });
    } catch {
      toast.error("Token inválido!", {
        duration: 2000,
        onAutoClose: () => router.replace("/auth/sign-in"),
      });
      setTimeout(() => router.replace("/auth/sign-in"), 2000);
    }
  }, [token, router]);

  const onSubmit = async (data: ResetFormValues) => {
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: userData?.email,
        password: data.password,
      });
      toast.success("Senha redefinida com sucesso!");
      router.replace("/auth/sign-in");
    } catch {
      toast.error("Erro ao redefinir senha. Verifique o token.");
    }
    setLoading(false);
  };

  if (!userData) {
    return null; // ou um loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Redefinir senha</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input value={userData.name} disabled />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={userData.email} disabled />
                </FormControl>
              </FormItem>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nova senha"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Redefinindo..." : "Redefinir senha"}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <Link
              href="/auth/sign-in"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Voltar para login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
