// src/app/onboarding/steps/mediakit/actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const InputSchema = z.object({
  handle: z.string().min(3).max(30).regex(/^[a-z0-9]+$/, "Handle must be lowercase alphanumeric only"),
  title: z.string().min(1).max(100),
  bio: z.string().min(10).max(500),
  website: z.string().url().optional().or(z.literal("")),
});

export async function createMediaKit(formData: FormData) {
  try {
    console.log("Creating media kit...");
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const parsed = InputSchema.parse({
      handle: formData.get("handle")?.toString(),
      title: formData.get("title")?.toString(),
      bio: formData.get("bio")?.toString(),
      website: formData.get("website")?.toString(),
    });

    console.log("Parsed media kit data:", parsed);

    // Check if handle is already taken
    const existingMediaKit = await prisma.mediaKit.findUnique({
      where: { handle: parsed.handle }
    });

    if (existingMediaKit) {
      throw new Error("Handle is already taken");
    }

    // Create the media kit
    const mediaKit = await prisma.mediaKit.create({
      data: {
        userId: session.user.id,
        handle: parsed.handle,
        title: parsed.title,
        bio: parsed.bio,
        website: parsed.website || null,
        links: {}, // Empty JSON object for social links
      },
    });

    console.log("Media kit created:", mediaKit.id);

    // Mark onboarding as completed
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingCompleted: true }
    });

    console.log("Onboarding completed, redirecting to dashboard");
    
    // Revalidate the layout to update onboarding status
    revalidatePath("/dashboard");
    
    redirect("/dashboard"); // Go DIRECTLY to dashboard, skip done page for now
    
  } catch (error) {
    console.error("Media kit creation error:", error);
    
    // Check if this is actually a successful redirect (Next.js throws on redirect)
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("NEXT_REDIRECT")) {
      console.log("Redirect successful, media kit created");
      return; // Don't throw error for successful redirects
    }
    
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      throw new Error("Invalid data format. Please check your inputs.");
    }
    
    if (errorMessage.includes("already taken")) {
      throw new Error("Handle is already taken. Please choose another one.");
    }
    
    throw new Error("Failed to create media kit. Please try again.");
  }
}