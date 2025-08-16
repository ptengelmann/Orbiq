// src/components/AppShell.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import UserMenu from "./UserMenu";
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
  HelpCircle
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

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return <div>Loading...</div>;
  }

  // Get user data for the shell
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      creatorType: true,
      image: true,
      mediaKits: {
        select: { handle: true },
        take: 1,
        orderBy: { createdAt: "desc" }
      }
    }
  });

  const navigation = userData?.role === "AGENCY" ? agencyNavigation : creatorNavigation;
  const mediaKitHandle = userData?.mediaKits[0]?.handle;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Orbiq</h1>
            <p className="text-xs text-gray-500 capitalize">
              {userData?.role === "AGENCY" ? "Agency" : "Creator"} workspace
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="px-4 py-4 border-t border-gray-200">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            {userData?.image ? (
              <img src={userData.image} alt="" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{userData?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {userData?.creatorType || userData?.role?.toLowerCase()}
              </p>
            </div>
          </div>
          
          {/* Media Kit Quick Link (Creator only) */}
          {userData?.role === "CREATOR" && mediaKitHandle && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">Media Kit Live</span>
              </div>
              <Link 
                href={`https://orbiq.co/u/${mediaKitHandle}`}
                target="_blank"
                className="text-xs text-green-700 hover:text-green-900 font-mono block truncate"
              >
                orbiq.co/u/{mediaKitHandle}
              </Link>
            </div>
          )}

          {/* Help Link */}
          <Link 
            href="/dashboard/help"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Help & Support
          </Link>

          {/* User Menu */}
          <div className="mt-2">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}