"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

function handleify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "").slice(0, 20) || "me";
}

export async function createMediaKit(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const handleInput = formData.get("handle")?.toString() || "me";
  const title = formData.get("title")?.toString() || "";
  const bio = formData.get("bio")?.toString() || "";

  let handle = handleify(handleInput);
  let i = 1;
  while (await prisma.mediaKit.findUnique({ where: { handle } })) {
    handle = `${handleify(handleInput)}${i++}`;
  }

  await prisma.mediaKit.create({
    data: {
      userId: session.user.id,
      handle,
      title,
      bio,
      links: {},
    },
  });

  redirect("/onboarding");
}
