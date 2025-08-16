// src/app/api/check-handle/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');

    if (!handle || handle.length < 3) {
      return Response.json({ available: false, error: "Handle too short" });
    }

    // Check if handle exists
    const existing = await prisma.mediaKit.findUnique({
      where: { handle },
      select: { id: true }
    });

    return Response.json({ available: !existing });
    
  } catch (error) {
    console.error("Handle check error:", error);
    // If check fails, assume available to not block user
    return Response.json({ available: true });
  }
}