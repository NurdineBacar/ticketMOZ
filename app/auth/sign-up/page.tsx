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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/hook-langauge";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signUpSchema = z
  .object({
    user_type: z.string(),
    name: z
      .string()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
      .max(8, { message: "A senha deve ter no máximo 8 caracteres" }),
    confirmPassword: z.string(),
    company_name: z.string().optional(),
    company_email: z.string().email().optional().or(z.literal("")),
    company_phone: z.string().optional(),
    company_nuit: z
      .union([
        z.number().min(9, { message: "NUIT deve ter pelo menos 9 dígitos" }),
        z.string().length(0), // Permite string vazia
      ])
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.user_type === "promoter") {
        return (
          data.company_name &&
          data.company_nuit &&
          data.company_email &&
          data.company_phone
        );
      }
      return true;
    },
    {
      message: "Todos os campos da empresa são obrigatórios para promotores",
      path: ["company_name"],
    }
  );

type signUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();

  const t = useTranslation();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
    hasMinLength: false,
    isValid: false,
  });

  const methods = useForm<signUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      user_type: "client",
      company_nuit: undefined as unknown as number,
      company_name: "",
      company_email: "",
      company_phone: "",
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: signUpFormValues) => {
    setLoading(true);
    try {
      const response = await api.post("/user/create", {
        name: data.name,
        email: data.email,
        user_type: data.user_type,
        password: data.password,
        company: {
          name: data.company_name,
          email: data.company_email,
          phone_number: data.company_phone,
          nuit: data.company_nuit,
        },
      });

      const json = response.data;
      if (!json.success) {
        // toast("Erro", {
        //   description: json.message,
        // });

        toast.error("Erro", {
          description: json.message,
        });
        return;
      } else {
        toast.success("Sucesso", {
          description: "Utilizaor cadastrado com sucesso!",
        });
        router.replace("/auth/sign-in");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === "password" || !name) {
        const password = value.password || "";
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
        const hasMinLength = password.length >= 6;
        const isValid =
          hasUpperCase &&
          hasLowerCase &&
          hasNumber &&
          hasSpecial &&
          hasMinLength;

        setPasswordStrength({
          hasUpperCase,
          hasLowerCase,
          hasNumber,
          hasSpecial,
          hasMinLength,
          isValid,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  return (
    <div className="flex items-center justify-center min-h-screen auth-container">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center animate-fade-in">
          {/* Image column - hidden on mobile */}
          <div className="hidden md:block md:w-1/2 lg:w-2/5">
            <div className="relative h-full flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800"
                alt="Signup"
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-lg"></div>
            </div>
          </div>

          {/* Form column */}
          <div className="w-full max-w-md md:w-1/2 lg:w-3/5">
            <Card className="border-2 overflow-y-auto md:max-h-[83vh]">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">{t("createAccount")}</CardTitle>
                <CardDescription>
                  Informe seus dados para criar uma conta na TicketMOZ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-4"></div>

                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <article className="space-y-4">
                      <div className="space-y-2">
                        <FormField
                          control={methods.control}
                          name="user_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("accountType")}</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger
                                    id="user-type"
                                    className={"h-10 w-full"}
                                  >
                                    <SelectValue placeholder="Selecione o tipo de conta" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cliente">
                                      {t("buyer")}
                                    </SelectItem>
                                    <SelectItem value="promotor">
                                      {t("promoter")}
                                    </SelectItem>
                                    <SelectItem value="scanner">
                                      {t("scanner")}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {methods.watch("user_type") === "promoter" && (
                        <>
                          <div className="space-y-2">
                            <FormField
                              control={methods.control}
                              name="company_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("companyName")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      id="company-name"
                                      placeholder="MozTicket Eventos Ltda."
                                      {...field}
                                      required
                                      className={"h-10"}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <FormField
                              control={methods.control}
                              name="company_nuit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("taxId")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      id="tax-id"
                                      placeholder="123456789"
                                      value={field.value || ""}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(
                                          value === ""
                                            ? undefined
                                            : Number(value)
                                        );
                                      }}
                                      required
                                      className={"h-10"}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <FormField
                              control={methods.control}
                              name="company_email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email da empresa</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="company email@mail.com"
                                      {...field}
                                      required
                                      className="h-10"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <FormField
                              control={methods.control}
                              name="company_phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Numero da empresa</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="82/83/84/85/86/87 *******"
                                      {...field}
                                      required
                                      className="h-10"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <FormField
                          control={methods.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("name")}</FormLabel>
                              <FormControl>
                                <Input
                                  id="name"
                                  placeholder="João Silva"
                                  {...field}
                                  required
                                  className={"h-10"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormField
                          control={methods.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("email")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="João Silva"
                                  {...field}
                                  required
                                  className={"h-10"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormField
                          control={methods.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("password")}</FormLabel>
                              <FormControl>
                                <Input
                                  id="password"
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                  required
                                  className={"h-10"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Password strength indicators */}
                        {methods.watch("password") && (
                          <div className="mt-2 space-y-1 text-sm">
                            <p className="font-medium">
                              {t("passwordRequirements")}
                            </p>
                            <ul className="space-y-1">
                              <li className="flex items-center gap-2">
                                {passwordStrength.hasUpperCase ? (
                                  <Check size={16} className="text-green-600" />
                                ) : (
                                  <X size={16} className="text-red-600" />
                                )}
                                {t("uppercaseLetter")}
                              </li>
                              <li className="flex items-center gap-2">
                                {passwordStrength.hasLowerCase ? (
                                  <Check size={16} className="text-green-600" />
                                ) : (
                                  <X size={16} className="text-red-600" />
                                )}
                                {t("lowercaseLetter")}
                              </li>
                              <li className="flex items-center gap-2">
                                {passwordStrength.hasNumber ? (
                                  <Check size={16} className="text-green-600" />
                                ) : (
                                  <X size={16} className="text-red-600" />
                                )}
                                {t("numberRequired")}
                              </li>
                              <li className="flex items-center gap-2">
                                {passwordStrength.hasSpecial ? (
                                  <Check size={16} className="text-green-600" />
                                ) : (
                                  <X size={16} className="text-red-600" />
                                )}
                                {t("specialChar")}
                              </li>
                              <li className="flex items-center gap-2">
                                {passwordStrength.hasMinLength ? (
                                  <Check size={16} className="text-green-600" />
                                ) : (
                                  <X size={16} className="text-red-600" />
                                )}
                                {t("minLength")}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <FormField
                          control={methods.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("confirmPassword")}</FormLabel>
                              <FormControl>
                                <Input
                                  id="confirm-password"
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                  required
                                  className={"h-10"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">
                        Contas de administrador só podem ser criadas por outros
                        administradores.
                      </p>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !passwordStrength.isValid}
                        size={"lg"}
                      >
                        {loading ? "Criando conta..." : t("createAccount")}
                      </Button>

                      <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                          {t("alreadyHaveAccount")}
                        </span>{" "}
                        <Link
                          href="/auth/sign-in"
                          className="hover:text-primary"
                        >
                          {t("login")}
                        </Link>
                      </div>
                    </article>
                  </form>
                </FormProvider>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
