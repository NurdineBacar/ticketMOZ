"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { Label } from "@/components/ui/label";

interface UserDetailsDialogProps {
  user: User;
  children: React.ReactNode;
}

export function UserDetailsDialog({ user, children }: UserDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Utilizador</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Nome:</Label>
            <span className="col-span-3">{user.name}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Email:</Label>
            <span className="col-span-3">{user.email}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tipo:</Label>
            <span className="col-span-3 capitalize">{user.user_type}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Estado:</Label>
            <span className="col-span-3">
              {user.isVerify ? (
                <span className="text-green-600">Ativo</span>
              ) : (
                <span className="text-red-500">Bloqueado</span>
              )}
            </span>
          </div>

          {user.user_type === "promotor" && user.company && (
            <>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-3">Informações da Empresa</h4>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Nome:</Label>
                  <span className="col-span-3">{user.company.name}</span>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Email:</Label>
                  <span className="col-span-3">{user.company.email}</span>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Telefone:</Label>
                  <span className="col-span-3">
                    {user.company.phone_number}
                  </span>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">NUIT:</Label>
                  <span className="col-span-3">{user.company.nuit_url}</span>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Estado:</Label>
                  <span className="col-span-3">
                    {user.company.isVerify ? (
                      <span className="text-green-600">Aprovada</span>
                    ) : (
                      <span className="text-yellow-500">Pendente</span>
                    )}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
