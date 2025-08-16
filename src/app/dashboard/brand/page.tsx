// src/app/dashboard/brand/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createBrandKit } from "./actions";
import SubmitButton from "@/components/SubmitButton";

function Swatch({ hex }: { hex: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 rounded border" style={{ backgroundColor: hex }} />
      <code className="text-sm">{hex}</code>
    </div>
  );
}

export default async function BrandPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p>
          Please <Link className="underline" href="/auth/sign-in">sign in</Link>.
        </p>
      </main>
    );
  }

  const kits = await prisma.brandKit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  type BrandKitItem = typeof kits[number];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Brand Kit Generator</h1>
        <p className="text-sm text-gray-600">
          Describe your vibe and audience. We&apos;ll generate palette, tone, tagline, and logo prompts.
        </p>
      </div>

      <form action={createBrandKit} className="grid gap-4 rounded-lg border p-4">
        <div>
          <label className="block text-sm font-medium">Brand name (optional)</label>
          <input name="brandName" placeholder="Orbiq" className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Vibe / Style</label>
          <textarea
            name="vibe"
            placeholder="Bold, modern, minimal, confident, tech-forward..."
            className="mt-1 w-full rounded-md border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Audience</label>
          <input
            name="audience"
            placeholder="Gen Z creators, fitness fans, indie gamers..."
            className="mt-1 w-full rounded-md border px-3 py-2"
            required
          />
        </div>
        <SubmitButton>Generate Brand Kit</SubmitButton>
      </form>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Recent Kits</h2>
        {kits.length === 0 ? (
          <p className="text-sm text-gray-600">No kits yet. Generate your first one above.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {kits.map((k: BrandKitItem) => (
              <div key={k.id} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <h3 className="font-medium">{k.brandName ?? "Untitled brand"}</h3>
                    <p className="text-sm text-gray-600">{k.tagline}</p>
                  </div>
                  <time className="text-xs text-gray-500">
                    {new Date(k.createdAt).toLocaleString()}
                  </time>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Palette</p>
                    <div className="mt-1 grid gap-1">
                      {k.palette.map((hex: string) => <Swatch key={hex} hex={hex} />)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Voice attributes</p>
                    <ul className="mt-1 list-disc pl-5 text-sm">
                      {Array.isArray((k.voice as any)?.attributes) &&
                        (k.voice as any).attributes.slice(0, 4).map((v: string, i: number) => (
                          <li key={i}>{v}</li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Logo prompts</p>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {k.logoPrompts.slice(0, 3).map((p: string, i: number) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
