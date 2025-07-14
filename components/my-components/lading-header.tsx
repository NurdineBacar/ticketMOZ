"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
// import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { LogIn, UserPlus, User, Globe } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/hook-langauge";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
// import LanguageSelector from '@/components/LanguageSelector';

const LandingHeader = () => {
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  const t = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isAuthenticated, user } = useAuth();

  // Array de valores para exibir na lista
  const valoresList = [
    "Transparência em todas as nossas operações",
    "Segurança para promotores e público",
    "Experiências memoráveis em cada evento",
    "Tecnologia a serviço da cultura e do entretenimento",
    "Apoio aos talentos locais",
  ];

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            TicketMOZ
          </Link>

          <nav>
            <ul className="flex items-center  space-x-2 md:space-x-6">
              <li>
                {/* <LanguageSelector 
                  position="static" 
                  variant="ghost" 
                  className="text-white hover:bg-gray-800" 
                /> */}
                <Globe />
              </li>
              <li className={isMobile ? "block" : "hidden md:block"}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hover:text-gray-300 transition"
                      size={isMobile ? "sm" : "default"}
                    >
                      <span className="hidden md:block">{t("about")}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>{t("aboutTitle")}</DialogTitle>
                      <DialogDescription>
                        {t("aboutDescription")}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                      <h4 className="text-lg font-semibold mb-2">
                        {t("ourMission")}
                      </h4>
                      <p className="mb-4 text-gray-700">{t("missionText")}</p>

                      <h4 className="text-lg font-semibold mb-2">
                        {t("whoWeAre")}
                      </h4>
                      <p className="mb-4 text-gray-700">{t("whoWeAreText")}</p>

                      <h4 className="text-lg font-semibold mb-2">
                        {t("ourValues")}
                      </h4>
                      <ul className="list-disc pl-5 mb-4 text-gray-700">
                        {valoresList.map((value, index) => (
                          <li key={index}>{value}</li>
                        ))}
                      </ul>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
              {isAuthenticated ? (
                <li>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size={isMobile ? "lg" : "sm"}>
                        <User size={16} className="mr-1" />
                        {t("myAccount")}
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{t("myAccount")}</SheetTitle>
                        <SheetDescription>{t("accountInfo")}</SheetDescription>
                      </SheetHeader>

                      <div className="py-6 space-y-4 px-5">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {t("accountName")}
                          </p>
                          <p className="text-sm text-gray-500">{user?.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {t("accountEmail")}
                          </p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {t("accountTypeHeader")}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {user?.user_type}
                          </p>
                        </div>
                      </div>
                      <SheetFooter className="flex flex-col gap-2">
                        <Button
                          asChild
                          size={isMobile ? "lg" : "sm"}
                          className="mr-2 w-full"
                        >
                          <Link
                            href={
                              user.user_type == "promotor"
                                ? `/events`
                                : user.user_type == "scanner"
                                ? "scanner-events"
                                : "profile"
                            }
                          >
                            {t("goDashboard")}
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size={isMobile ? "lg" : "sm"}
                          className="w-full"
                          onClick={() => {
                            signOut();
                            router.refresh();
                          }}
                        >
                          {t("signOut")}
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </li>
              ) : (
                <>
                  <li>
                    <Button
                      variant="ghost"
                      size={isMobile ? "lg" : "sm"}
                      asChild
                    >
                      <Link href="/auth/sign-in">
                        <LogIn size={16} className="mr-1" />
                        {t("login")}
                      </Link>
                    </Button>
                  </li>
                  <li className="hidden md:block">
                    <Button size={isMobile ? "lg" : "sm"} asChild>
                      <Link href="/auth/sign-up">
                        <UserPlus size={16} className="mr-1" />
                        {t("signup")}
                      </Link>
                    </Button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
