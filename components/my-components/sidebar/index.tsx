"use client";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Ticket,
  User,
  Menu,
  X,
  SquareDashedBottom,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import NavItem from "./nav-item";
import Cookies from "js-cookie";
import { User as UserType } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type NavLinks = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

export default function MySideBar() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [routes, setRoutes] = useState<NavLinks[] | []>([]);

  const promotor = [
    { to: "/events", icon: <Calendar size={20} />, label: "Eventos" },
    { to: "/tickets", icon: <Ticket size={20} />, label: "Bilhetes" },
    { to: "/reports", icon: <FileText size={20} />, label: "Relatorios" },
    { to: "/profile", icon: <User size={20} />, label: "Perfil" },
  ];

  const scanner = [
    { to: "/scanner-events", icon: <Calendar size={20} />, label: "Eventos" },
    { to: "/profile", icon: <User size={20} />, label: "Perfil" },
  ];

  const masterAdmin = [
    {
      to: "/report-admin",
      icon: <SquareDashedBottom size={20} />,
      label: "Painel Adminstrador",
    },
    { to: "/profile", icon: <User size={20} />, label: "Perfil" },
    // {
    //   to: "/admin-notifications",
    //   icon: <FileText size={20} />,
    //   label: "Notificações",
    // },
  ];

  const client = [
    { to: "/profile", icon: <User size={20} />, label: "Perfil" },
  ];

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      switch (user.user_type) {
        case "promotor":
          setRoutes(promotor);
          break;
        case "scanner":
          setRoutes(scanner);
          break;
        case "master-admin":
          setRoutes(masterAdmin);
          break;
        case "cliente":
          setRoutes(client);
          break;
        default:
          break;
      }
    }
  }, [user]);

  return (
    <>
      {/* Mobile Navbar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 bg-sidebar border-b z-50 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Ticket />
          <h2 className="text-xl font-bold">TicketMOZ</h2>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded-md focus:outline-none"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 bg-opacity-50 z-40 mt-14"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed flex flex-col bg-sidebar h-screen border-r transition-all duration-300 z-50",
          "lg:w-64 lg:relative",
          "w-64",
          "max-lg:fixed max-lg:top-14 max-lg:left-0 max-lg:transform",
          mobileMenuOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
          isCollapsed ? "lg:w-64" : "lg:w-16"
        )}
      >
        {/* Desktop Header */}
        <header
          className={cn(
            "flex gap-2 border-b h-14 items-center",
            isCollapsed ? "lg:pl-6" : "lg:justify-center",
            "max-lg:hidden"
          )}
        >
          <Ticket />
          {isCollapsed && <h2 className="text-xl font-bold mb-1">TicketMOZ</h2>}
        </header>

        {/* User Section */}
        <section
          className={cn(
            "h-20 border-b flex items-center",
            isCollapsed ? "lg:pl-6" : "lg:justify-center",
            "max-lg:hidden"
          )}
        >
          <div className="bg-black w-9 h-9 rounded-full flex items-center justify-center">
            <User color="white" size={20} />
          </div>
          {isCollapsed && (
            <article className="ml-2">
              <Label className="text-base -mb-1">{user?.name}</Label>
              <span className="text-gray-300 text-sm ">{user?.user_type}</span>
            </article>
          )}
        </section>

        {/* Navigation Items */}
        <main className="mt-2 px-3 flex flex-col gap-2 flex-1 overflow-y-auto">
          {routes.map((t, index) => (
            <NavItem
              key={index}
              isCollapsed={isCollapsed}
              icon={t.icon}
              isActive={false}
              label={t.label}
              to={t.to}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}
        </main>

        {/* Collapse Button - Desktop Only */}
        <div
          className={cn(
            "absolute left-60 z-50 top-10 transition-all duration-300",
            isCollapsed ? "left-60" : "left-12",
            "max-lg:hidden"
          )}
        >
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-full shadow-md h-8 w-8 flex items-center justify-center"
            aria-label={isCollapsed ? "Recolher menu" : "Expandir menu"}
          >
            {isCollapsed ? (
              <ChevronLeft size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </Button>
        </div>

        {/* Logout Button - Fixed */}
        <div className="border-t w-full p-4 mt-auto relative bottom-14 md:bottom-auto">
          <Button
            variant={"outline"}
            className="w-full gap-2"
            onClick={() => {
              signOut();
              router.replace("/");
            }}
          >
            <LogOut size={16} />
            {isCollapsed && "Terminar sessão"}
          </Button>
        </div>
      </aside>

      {/* Spacer for mobile navbar */}
      <div className="lg:hidden h-14"></div>
    </>
  );
}
