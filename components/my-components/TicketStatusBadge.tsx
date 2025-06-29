"use client";
import { cn } from "@/lib/utils";

interface TicketStatusBadgeProps {
  status: "valid" | "used" | "invalid" | "active" | "upcoming" | "completed";
  size?: "sm" | "md";
}

export default function TicketStatusBadge({
  status,
  size = "sm",
}: TicketStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "valid":
      case "active":
        return "bg-green-100 text-green-800";
      case "used":
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "invalid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full font-medium",
        getStatusStyles(),
        size === "sm" ? "text-xs" : "text-sm"
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
