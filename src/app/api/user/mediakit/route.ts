// src/app/api/user/mediakit/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mediaKit = await prisma.mediaKit.findFirst({
    where: { userId: session.user.id },
    select: { handle: true, title: true }
  });

  return Response.json(mediaKit);
}