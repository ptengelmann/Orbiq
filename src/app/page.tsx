import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Orbiq</h1>
      <p className="mt-4 text-lg text-gray-600">
        Build, grow, and monetise your creator brand — in one place.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/onboarding" className="rounded-md border px-4 py-2 hover:bg-gray-50">Get started</Link>
        <Link href="/dashboard" className="rounded-md border px-4 py-2 hover:bg-gray-50">Go to dashboard</Link>
      </div>
    </main>
  );
}
