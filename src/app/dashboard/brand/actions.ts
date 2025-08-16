"use server";

import { z, type ZodIssue } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatJSON } from "@/lib/openai";

const InputSchema = z.object({
  brandName: z.string().min(2).max(60).optional(),
  vibe: z.string().min(10, "Describe the style / vibe (min 10 chars)"),
  audience: z.string().min(5, "Tell us your audience (min 5 chars)"),
});

type BrandKitPayload = {
  tagline: string;
  palette: string[];
  voice: { attributes: string[]; dos: string[]; donts: string[] };
  logoPrompts: string[];
};

const PayloadSchema: z.ZodType<BrandKitPayload> = z.object({
  tagline: z.string(),
  palette: z.array(z.string().regex(/^#([0-9A-Fa-f]{6})$/)).min(5).max(6),
  voice: z.object({
    attributes: z.array(z.string()).min(3).max(6),
    dos: z.array(z.string()).min(3).max(6),
    donts: z.array(z.string()).min(3).max(6),
  }),
  logoPrompts: z.array(z.string()).min(3).max(5),
});

export async function createBrandKit(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const parsed = InputSchema.safeParse({
    brandName: formData.get("brandName")?.toString() || undefined,
    vibe: formData.get("vibe")?.toString() || "",
    audience: formData.get("audience")?.toString() || "",
  });

  if (!parsed.success) {
    const msg = parsed.error.issues.map((i: ZodIssue) => i.message).join("; ");
    throw new Error(`Invalid input: ${msg}`);
  }

  const { brandName, vibe, audience } = parsed.data;

  const system = `You are a brand identity expert.
Return ONLY a strict JSON object with keys: tagline, palette, voice, logoPrompts.
- palette: 5-6 hex colors, high contrast and cohesive for web
- voice: { attributes:[], dos:[], donts:[] } (3-6 items each)
- logoPrompts: 3-5 short prompts for a logo generator
No commentary, no Markdown — just JSON.`;

  const user = `Inputs:
Brand Name: ${brandName ?? "N/A"}
Vibe: ${vibe}
Audience: ${audience}`;

  const content = await chatJSON({ system, user, model: "gpt-4o-mini" });

  let data: BrandKitPayload;
  try {
    data = PayloadSchema.parse(JSON.parse(content));
  } catch {
    throw new Error("AI returned invalid JSON. Try again with a clearer vibe.");
  }

  await prisma.brandKit.create({
    data: {
      userId: session.user.id,
      brandName,
      vibe,
      audience,
      tagline: data.tagline,
      palette: data.palette,
      voice: data.voice as unknown as Record<string, unknown>,
      logoPrompts: data.logoPrompts,
    },
  });

  revalidatePath("/dashboard/brand");
  redirect("/dashboard/brand");
}
