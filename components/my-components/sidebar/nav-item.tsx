import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
};

export default function NavItem({
  to,
  icon,
  label,
  isCollapsed,
  onClick,
}: NavItemProps) {
  const path = usePathname();

  return (
    <Link
      href={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        path === to
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground",
        !isCollapsed ? "justify-center" : ""
      )}
      onClick={onClick}
    >
      {icon}
      {isCollapsed && <span>{label}</span>}
    </Link>
  );
}
