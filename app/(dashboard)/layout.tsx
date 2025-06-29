"use client";
import MySideBar from "@/components/my-components/sidebar";
import { Button } from "@/components/ui/button";

import { useTranslation } from "@/hooks/hook-langauge";
import { useAuth } from "@/hooks/useAuth";
import { User as UserType } from "@/types/user";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function DashLayouy({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const t = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <main className="flex flex-col md:flex-row w-screen">
      <aside>
        <MySideBar />
      </aside>

      <main className="flex flex-col w-full">
        <header className="h-14 border-b flex items-center justify-between px-4 md:px-6 fixed top-0 w-full bg-background z-30 md:relative">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium capitalize ml-8 md:ml-0">
              {user?.role} {t("dashboard")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Add Language Selector to header for easy access */}
            {/* <LanguageSelector position="relative" className="" /> */}
            <Button>Language selector</Button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <User size={16} />
              </div>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {t("welcome")}, {user?.name}
              </span>
            </div>
          </div>
        </header>

        <section id="bdoy-content" className="py-3 w-full ">
          {children}
        </section>
      </main>
    </main>
  );
}
