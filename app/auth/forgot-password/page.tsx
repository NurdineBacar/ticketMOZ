"use client";

import { useState } from "react";
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
import Link from "next/link";
import { AuthService } from "@/service/auth/auth-service";

const forgotSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setLoading(true);
    try {
      const verifyResp = await authService.verifyUser(data.email);
      if (verifyResp) {
        const mailResp = await authService.sendMailUser(data.email);
        if (mailResp.success) {
          toast.success("O email foi enviado coma s intrucoes");
        } else {
          toast.error(mailResp.message || "Falha ao enviar o email 1");
        }
      } else {
        toast.success(verifyResp || "falha ao enviar o email");
        // Show same message whether user exists or not for security
      }
    } catch (error) {
      toast.error("Error requesting password recovery");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar"}
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
