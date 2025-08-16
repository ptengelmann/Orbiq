// src/components/AppShell.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserMenu from "@/components/UserMenu"; // <-- add this

type Role = "CREATOR" | "AGENCY" | "ADMIN";

function nav(role: Role) {
  return role === "AGENCY"
    ? [
        { href: "/dashboard", label: "Overview" },
        { href: "/dashboard/roster", label: "Roster" },
        { href: "/dashboard/campaigns", label: "Campaigns" },
        { href: "/dashboard/reports", label: "Reports" },
      ]
    : [
        { href: "/dashboard", label: "Overview" },
        { href: "/dashboard/brand", label: "Brand Kit" },
        { href: "/dashboard/campaigns", label: "Campaigns" },
        { href: "/dashboard/analytics", label: "Analytics" },
      ];
}

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user?.role ?? "CREATOR") as Role;
  const items = nav(role);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold">Orbiq</Link>
            <nav className="flex gap-4">
              {items.map((n) => (
                <Link key={n.href} href={n.href} className="text-sm hover:underline">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="text-sm text-gray-600">
            {session?.user ? (
              <UserMenu
                name={session.user.name ?? "User"}
                email={session.user.email ?? ""}
              />
            ) : (
              <Link href="/auth/sign-in" className="underline">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
