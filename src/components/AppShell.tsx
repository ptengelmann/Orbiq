// src/components/AppShell.tsx
"use client";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  Sparkles, 
  LayoutDashboard, 
  Palette, 
  Globe, 
  Target, 
  BarChart3, 
  DollarSign,
  Settings,
  Users,
  FileText,
  Mail,
  UserCircle,
  Building,
  HelpCircle,
  LogOut
} from "lucide-react";

const creatorNavigation = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Brand", href: "/dashboard/brand", icon: Palette },
  { name: "Opportunities", href: "/dashboard/opportunities", icon: Mail },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Target },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const agencyNavigation = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Roster", href: "/dashboard/roster", icon: Users },
  { name: "Briefs", href: "/dashboard/briefs", icon: FileText },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Target },
  { name: "CRM", href: "/dashboard/crm", icon: Building },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface AppShellProps {
  children: React.ReactNode;
  userData: {
    name: string;
    email: string;
    role: string;
    creatorType: string;
    image: string;
    mediaKits: { handle: string }[];
  };
}

export default function AppShell({ children, userData }: AppShellProps) {
  const navigation = userData?.role === "AGENCY" ? agencyNavigation : creatorNavigation;
  const mediaKitHandle = userData?.mediaKits[0]?.handle;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/20">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Orbiq</h1>
              <p className="text-xs text-purple-200 capitalize">
                {userData?.role === "AGENCY" ? "Agency" : "Creator"} workspace
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/80 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20"
                >
                  <Icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="px-4 py-4 border-t border-white/20">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
              {userData?.image ? (
                <img src={userData.image} alt="" className="w-10 h-10 rounded-full border-2 border-white/20" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{userData?.name}</p>
                <p className="text-xs text-purple-200 truncate capitalize">
                  {userData?.creatorType || userData?.role?.toLowerCase()}
                </p>
              </div>
            </div>
            
            {/* Media Kit Quick Link (Creator only) */}
            {userData?.role === "CREATOR" && mediaKitHandle && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-green-300" />
                  <span className="text-xs font-medium text-green-100">Media Kit Live</span>
                </div>
                <Link 
                  href={`https://orbiq.co/u/${mediaKitHandle}`}
                  target="_blank"
                  className="text-xs text-green-200 hover:text-white font-mono block truncate transition-colors"
                >
                  orbiq.co/u/{mediaKitHandle}
                </Link>
              </div>
            )}

            {/* Help Link */}
            <Link 
              href="/dashboard/help"
              className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 border border-transparent hover:border-white/20 mb-2"
            >
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </Link>

            {/* Logout */}
            <button 
              onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-400/30"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="pl-64 flex-1">
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}