"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FileText, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/records", label: "Records", icon: FileText },
  { href: "/diagnostic/new", label: "New Diagnostic", icon: Activity },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#252840] bg-[#12141f]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/OralSense AI Logo.png"
            alt="OralSense AI"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#a0a8b8] transition hover:bg-[#1e2235] hover:text-[#6dbf8f]",
                pathname.startsWith(href) && "bg-[#6dbf8f]/10 text-[#6dbf8f]",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-[#a0a8b8] md:inline">
            {user?.full_name || user?.email}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout()}
            aria-label="Logout"
            className="text-[#a0a8b8] hover:bg-[#1e2235] hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
