"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserService } from "@/service/user/user-service";
import { toast } from "sonner";

type Promoter = {
  id: string;
  name: string;
  email: string;
  isApproved?: boolean;
};

export default function AdminNotifications() {
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [loading, setLoading] = useState(true);
  const userService = new UserService();

  useEffect(() => {
    const fetchPromoters = async () => {
      setLoading(true);
      try {
        // Busque apenas promotores pendentes de aprovação
        const data = await userService.getPendingPromoters();
        setPromoters([]);
      } catch {
        toast.error("Erro ao carregar notificações de promotores.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromoters();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await userService.approvePromoter(id);
      setPromoters((prev) => prev.filter((p) => p.id !== id));
      toast.success("Promotor aprovado!");
    } catch {
      toast.error("Erro ao aprovar promotor.");
    }
  };

  return (
    <main className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificações de Registo de Promotores</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Carregando...</div>
          ) : promoters.length === 0 ? (
            <div className="text-gray-500">Nenhum promotor pendente.</div>
          ) : (
            <ul className="space-y-4">
              {promoters.map((promoter) => (
                <li
                  key={promoter.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <div className="font-bold">{promoter.name}</div>
                    <div className="text-sm text-gray-500">
                      {promoter.email}
                    </div>
                  </div>
                  <Button onClick={() => handleApprove(promoter.id)}>
                    Aprovar
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
