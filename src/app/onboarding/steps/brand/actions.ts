"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { chatJSON } from "@/lib/openai";
import { redirect } from "next/navigation";

const InputSchema = z.object({
  brandName: z.string().min(2).max(60).optional(),
  vibe: z.string().min(5),      // relaxed from 10
  audience: z.string().min(3),  // relaxed from 5
});

const PayloadSchema = z.object({
  tagline: z.string(),
  palette: z.array(z.string().regex(/^#([0-9A-Fa-f]{6})$/)).min(5).max(6),
  voice: z.object({
    attributes: z.array(z.string()).min(3).max(6),
    dos: z.array(z.string()).min(3).max(6),
    donts: z.array(z.string()).min(3).max(6),
  }),
  logoPrompts: z.array(z.string()).min(3).max(5),
});

export async function generateBrandKit(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const parsed = InputSchema.parse({
    brandName: formData.get("brandName")?.toString() || undefined,
    vibe: formData.get("vibe")?.toString() || "",
    audience: formData.get("audience")?.toString() || "",
  });

  const system = `You are a brand identity expert.
Return ONLY JSON with keys: tagline, palette, voice, logoPrompts.
palette: 5-6 hex colors. voice has attributes/dos/donts (3-6 each).`;

  const user = `Brand Name: ${parsed.brandName ?? "N/A"}
Vibe: ${parsed.vibe}
Audience: ${parsed.audience}`;

  const content = await chatJSON({ system, user, model: "gpt-4o-mini" });
  const data = PayloadSchema.parse(JSON.parse(content));

  await prisma.brandKit.create({
    data: {
      userId: session.user.id,
      brandName: parsed.brandName,
      vibe: parsed.vibe,
      audience: parsed.audience,
      tagline: data.tagline,
      palette: data.palette,
      voice: data.voice as any,
      logoPrompts: data.logoPrompts,
    },
  });

  redirect("/onboarding");
}
