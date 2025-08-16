// src/app/onboarding/steps/brand/actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { chatJSON } from "@/lib/openai";
import { redirect } from "next/navigation";

const InputSchema = z.object({
  brandName: z.string().min(1).max(60).optional(),
  customVibe: z.string().optional(),
  customAudience: z.string().optional(),
  selectedVibes: z.array(z.string()).optional(),
  selectedAudiences: z.array(z.string()).optional(),
});

// Simplified brand kit payload for the current schema
type BrandKitPayload = {
  tagline: string;
  palette: string[];
  voice: {
    attributes: string[];
    dos: string[];
    donts: string[];
  };
  logoPrompts: string[];
};

const PayloadSchema: z.ZodType<BrandKitPayload> = z.object({
  tagline: z.string(),
  palette: z.array(z.string().regex(/^#([0-9A-Fa-f]{6})$/)).min(5).max(8),
  voice: z.object({
    attributes: z.array(z.string()).min(3).max(6),
    dos: z.array(z.string()).min(3).max(6),
    donts: z.array(z.string()).min(3).max(6),
  }),
  logoPrompts: z.array(z.string()).min(3).max(5),
});

// Creator type to platform mapping
const CREATOR_PLATFORM_MAP = {
  youtuber: ["YouTube", "YouTube Shorts"],
  tiktoker: ["TikTok", "Instagram Reels"],
  instagrammer: ["Instagram", "Instagram Stories", "Instagram Reels"],
  streamer: ["Twitch", "YouTube Live"],
  podcaster: ["Spotify", "Apple Podcasts", "YouTube"],
  multi: ["YouTube", "TikTok", "Instagram"],
};

// Audience size to rate multipliers
const AUDIENCE_RATE_MAP = {
  micro: { base: 100, multiplier: 1, description: "Micro-influencer rates" },
  macro: { base: 500, multiplier: 2.5, description: "Growing creator rates" },
  mega: { base: 2000, multiplier: 5, description: "Established creator rates" },
  celebrity: { base: 10000, multiplier: 10, description: "Premium creator rates" },
};

// Niche-specific brand guidelines
const NICHE_BRAND_MAP = {
  lifestyle: {
    colors: ["warm", "approachable", "instagram-friendly"],
    voice: ["authentic", "relatable", "inspiring"],
  },
  fitness: {
    colors: ["energetic", "motivational", "bold"],
    voice: ["motivational", "encouraging", "results-driven"],
  },
  tech: {
    colors: ["modern", "sleek", "professional"],
    voice: ["informative", "innovative", "analytical"],
  },
  beauty: {
    colors: ["aesthetic", "trendy", "vibrant"],
    voice: ["glamorous", "confident", "trend-setting"],
  },
  business: {
    colors: ["professional", "trustworthy", "sophisticated"],
    voice: ["authoritative", "knowledgeable", "strategic"],
  }
};

export async function generateBrandKit(formData: FormData) {
  try {
    console.log("Starting brand kit generation...");
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    // Get user's profile data from signup
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        role: true,
        creatorType: true,
        agencyType: true,
        niches: true,
        audienceSize: true,
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    console.log("User profile:", user);

    const parsed = InputSchema.parse({
      brandName: formData.get("brandName")?.toString() || user.name || undefined,
      customVibe: formData.get("customVibe")?.toString(),
      customAudience: formData.get("customAudience")?.toString(),
      selectedVibes: formData.getAll("selectedVibes").map(v => v.toString()),
      selectedAudiences: formData.getAll("selectedAudiences").map(a => a.toString()),
    });

    console.log("Parsed form data:", parsed);

    // Use real user data with fallbacks
    const creatorType = user.creatorType || "youtuber";
    const niches = user.niches && user.niches.length > 0 ? user.niches : ["lifestyle"];
    const audienceSize = user.audienceSize || "macro";

    // Build intelligent context
    const platforms = CREATOR_PLATFORM_MAP[creatorType as keyof typeof CREATOR_PLATFORM_MAP] || ["Social Media"];
    const primaryNiche = niches[0] || "lifestyle";
    const nicheData = NICHE_BRAND_MAP[primaryNiche as keyof typeof NICHE_BRAND_MAP] || NICHE_BRAND_MAP.lifestyle;
    const rateData = AUDIENCE_RATE_MAP[audienceSize as keyof typeof AUDIENCE_RATE_MAP] || AUDIENCE_RATE_MAP.macro;

    // Build vibe and audience strings
    const vibeText = parsed.customVibe || (parsed.selectedVibes && parsed.selectedVibes.length > 0 
      ? parsed.selectedVibes.join(", ") 
      : nicheData.voice.join(", "));
    
    const audienceText = parsed.customAudience || (parsed.selectedAudiences && parsed.selectedAudiences.length > 0
      ? parsed.selectedAudiences.join(", ")
      : `${primaryNiche} enthusiasts`);

    console.log("Generation context:", {
      creatorType,
      platforms,
      niches,
      audienceSize,
      vibeText,
      audienceText
    });

    // Simplified AI prompt for better reliability
    const system = `You are a brand strategist for creators. Create a brand kit with ONLY these keys:
- tagline: A memorable tagline for this creator
- palette: Array of 5-6 hex color codes (e.g., ["#FF5733", "#33FF57"])
- voice: Object with attributes (array), dos (array), donts (array)
- logoPrompts: Array of 3-4 logo description prompts

Return ONLY valid JSON. No explanations.`;

    const user_prompt = `Creator: ${creatorType} on ${platforms.join(", ")}
Niches: ${niches.join(", ")}
Audience: ${audienceSize} (${audienceText})
Brand: ${parsed.brandName || "Personal Brand"}
Style: ${vibeText}

Create a brand kit for this ${primaryNiche} ${creatorType} with ${audienceSize} audience.`;

    console.log("Sending to AI:", { system, user_prompt });

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      throw new Error("AI service not configured");
    }

    const content = await chatJSON({ 
      system, 
      user: user_prompt, 
      model: "gpt-4o-mini" // Use the cheaper model for better reliability
    });
    
    console.log("AI response:", content);

    let data;
    try {
      data = PayloadSchema.parse(JSON.parse(content));
    } catch (parseError) {
      console.error("Failed to parse AI response, using fallback:", parseError);
      
      // Fallback brand kit based on niche
      data = {
        tagline: `${parsed.brandName || "Your Brand"} - ${primaryNiche} ${creatorType}`,
        palette: primaryNiche === "tech" 
          ? ["#667eea", "#764ba2", "#f093fb", "#4a90e2", "#50e3c2", "#b4ec51"]
          : primaryNiche === "fitness"
          ? ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a8e6cf", "#ff8b94", "#ffd93d"]
          : ["#ff9a8b", "#a8edea", "#fed6e3", "#ffeaa7", "#dda0dd", "#98fb98"],
        voice: {
          attributes: nicheData.voice,
          dos: [`Be ${nicheData.voice[0]}`, `Share ${primaryNiche} content`, "Engage authentically"],
          donts: ["Don't be fake", "Don't ignore your audience", "Don't post off-brand content"]
        },
        logoPrompts: [
          `Modern ${primaryNiche} logo for ${creatorType}`,
          `Clean ${vibeText} design for ${parsed.brandName}`,
          `${platforms[0]} optimized brand mark`
        ]
      };
    }

    console.log("Final data to save:", data);

    await prisma.brandKit.create({
      data: {
        userId: session.user.id,
        brandName: parsed.brandName,
        vibe: vibeText,
        audience: audienceText,
        tagline: data.tagline,
        palette: data.palette,
        voice: data.voice as any,
        logoPrompts: data.logoPrompts,
      },
    });

    console.log("Brand kit saved successfully");
    redirect("/onboarding/steps/mediakit");
    
  } catch (error) {
    console.error("Brand kit generation error:", error);
    
    // Fixed TypeScript errors: properly handle ZodError and unknown error types
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues); // Changed from .errors to .issues
      throw new Error("Invalid data format. Please check your inputs.");
    }
    
    if (error instanceof SyntaxError) {
      console.error("JSON parsing error:", error);
      throw new Error("AI response format error. Please try again.");
    }
    
    // Proper error handling for unknown error type
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage?.includes("API key")) {
      throw new Error("AI service configuration error. Please contact support.");
    }
    
    throw new Error("Failed to generate brand kit. Please try again.");
  }
}