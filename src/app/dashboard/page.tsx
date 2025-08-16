// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "CREATOR";
  const name = session?.user?.name ?? "User";
  const email = session?.user?.email ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {session?.user && (
          <p className="mt-1 text-sm text-gray-600">
            Welcome, <strong>{name}</strong> ({email}) — role: <strong>{role}</strong>
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Brand Kit</h3>
          <p className="mt-1 text-sm text-gray-600">
            Generate palette, voice, tagline & logo prompts.
          </p>
          <Link href="/dashboard/brand" className="mt-3 inline-block text-sm underline">
            Generate →
          </Link>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Campaigns</h3>
          <p className="mt-1 text-sm text-gray-600">Plan and track collaborations.</p>
          <span className="mt-3 inline-block text-sm text-gray-400">Coming soon</span>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Analytics</h3>
          <p className="mt-1 text-sm text-gray-600">Audience & revenue insights.</p>
          <span className="mt-3 inline-block text-sm text-gray-400">Coming soon</span>
        </div>
      </div>
    </div>
  );
}