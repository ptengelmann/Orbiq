"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export async function createWorkspace(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const name = (formData.get("name")?.toString() || "My Workspace").slice(0, 60);
  const type = (formData.get("type")?.toString() || "CREATOR_TEAM") as "CREATOR_TEAM" | "AGENCY";
  const slugBase = slugify(name) || "workspace";
  let slug = slugBase;
  let i = 1;
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${i++}`;
  }

  const org = await prisma.organization.create({
    data: { name, type, slug },
  });

  await prisma.membership.create({
    data: {
      userId: session.user.id,
      organizationId: org.id,
      role: "OWNER",
    },
  });

  // Update user.role based on org type (so we only ask once)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: type === "AGENCY" ? "AGENCY" : "CREATOR" },
  });

  redirect("/onboarding");
}
