import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "CREATOR";
  const name = session?.user?.name ?? "User";
  const email = session?.user?.email ?? "";

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {session?.user ? (
        <div className="mt-4">
          <p>
            Welcome, <strong>{name}</strong> ({email}) — role:{" "}
            <strong>{role}</strong>
          </p>
          <p className="mt-2 text-gray-600">
            This page is protected. You’re seeing it because you’re signed in.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-red-600">Not signed in.</p>
      )}
    </main>
  );
}
