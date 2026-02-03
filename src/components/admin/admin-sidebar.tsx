"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Home,
  LogOut,
  Shield,
  Gift,
  Coins,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Vouchers", href: "/admin/vouchers", icon: Gift },
  { name: "Credit Config", href: "/admin/credits", icon: Coins },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#E2E8F0] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <Link href="/admin/dashboard" className="flex items-center">
          <img src="/alphafin-full-logo.png" alt="AlphaFin" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#D1F5F3] text-[#089691] border border-[#0ABAB5]/20"
                    : "text-[#334155] hover:text-[#0ABAB5] hover:bg-[#F1F5F9]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#E2E8F0] space-y-1">
        <Link href="/dashboard">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#334155] hover:text-[#0ABAB5] hover:bg-[#F1F5F9] transition-all duration-200">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">User Dashboard</span>
          </div>
        </Link>
        <Link href="/">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#334155] hover:text-[#0ABAB5] hover:bg-[#F1F5F9] transition-all duration-200">
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Site</span>
          </div>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
