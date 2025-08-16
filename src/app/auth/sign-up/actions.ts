"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hash } from "bcryptjs";

const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(60),
  password: z.string().min(6),
  confirm: z.string().min(6),
}).refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

export async function register(formData: FormData) {
  const payload = RegisterSchema.parse({
    email: formData.get("email")?.toString(),
    name: formData.get("name")?.toString(),
    password: formData.get("password")?.toString(),
    confirm: formData.get("confirm")?.toString(),
  });

  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!existing) {
    const passwordHash = await hash(payload.password, 10);
    await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        role: "CREATOR",       // default; may be updated in onboarding
        passwordHash,
      },
    });
  }
  // send them to sign-in with email prefilled
  redirect("/auth/sign-in?email=" + encodeURIComponent(payload.email));
}
