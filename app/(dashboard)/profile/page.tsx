"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { UserService } from "@/service/user/user-service";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { loginSuccess } from "@/lib/redux/slices/auth";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("pt");
  const userService = new UserService();
  const dispatch = useDispatch();

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would update the user's profile
    console.log("Profile updated", { displayName, bio, preferredLanguage });

    const response = await userService.updateName(user.id, displayName);

    if (response.success) {
      toast.error("Successoa o atualizar dados do utilizador", {
        className: "bg-green-500 text-white",
      });

      Cookies.set("user", JSON.stringify(response.data));

      // Atualizar Redux
      dispatch(loginSuccess(response.data));
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      toast.error("Successoa o atualizar dados do utilizador", {
        className: "bg-red-500 text-white",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <main className="px-5 pt-5 ">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações do Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas configurações de conta e preferências
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            {/* <TabsTrigger value="appearance">Aparência</TabsTrigger> */}
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="text-lg">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {/* <Button variant="outline" size="sm">
                      Alterar foto
                    </Button> */}
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome de exibição</Label>
                      <Input
                        id="name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={
                          user.user_type == "master-admin" ? true : false
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email} disabled />
                      <p className="text-sm text-muted-foreground">
                        Seu email não pode ser alterado.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="user_type">Tipo de conta</Label>
                      <Input
                        id="role"
                        value={
                          user.user_type === "cliente"
                            ? "Comprador"
                            : user.user_type === "promotor"
                            ? "Promotor"
                            : user.user_type === "scanner"
                            ? "Scanner"
                            : "Master - Admin"
                        }
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* <div className="grid gap-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <textarea
                    id="bio"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte um pouco sobre você..."
                  />
                </div> */}

                {/* <div className="grid gap-2">
                  <Label htmlFor="language">Idioma preferido</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                  >
                    <option value="pt">Português</option>
                    <option value="en">English</option>
                  </select>
                </div> */}
                {user.user_type != "master-admin" && (
                  <div className="flex justify-end">
                    <Button onClick={handleUpdateProfile}>
                      Salvar alterações
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <select
                      id="theme"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <Button>Salvar preferências</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      className="rounded border-gray-300"
                      checked
                      disabled
                    />
                    <Label htmlFor="email-notifications">
                      Receber notificações por email
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="new-events"
                      className="rounded border-gray-300"
                      checked
                      disabled
                    />
                    <Label htmlFor="new-events">Novos eventos</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="tickets"
                      className="rounded border-gray-300"
                      disabled
                      checked
                    />
                    <Label htmlFor="tickets">Atualizações de bilhetes</Label>
                  </div>

                  {user.user_type != "master-admin" && (
                    <div className=" justify-end hidden">
                      <Button>Salvar preferências</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
