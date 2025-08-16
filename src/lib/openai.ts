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

type BrandKitPayload = {
  tagline: string;
  palette: string[];
  voice: {
    attributes: string[];
    dos: string[];
    donts: string[];
    tone: string;
    personality: string[];
  };
  logoPrompts: string[];
  contentTemplates: {
    platform: string;
    template: string;
  }[];
  rateCardSuggestions: {
    contentType: string;
    suggestedRate: string;
    justification: string;
  }[];
};

const PayloadSchema: z.ZodType<BrandKitPayload> = z.object({
  tagline: z.string(),
  palette: z.array(z.string().regex(/^#([0-9A-Fa-f]{6})$/)).min(5).max(8),
  voice: z.object({
    attributes: z.array(z.string()).min(3).max(6),
    dos: z.array(z.string()).min(4).max(8),
    donts: z.array(z.string()).min(4).max(8),
    tone: z.string(),
    personality: z.array(z.string()).min(3).max(5),
  }),
  logoPrompts: z.array(z.string()).min(4).max(6),
  contentTemplates: z.array(z.object({
    platform: z.string(),
    template: z.string(),
  })).min(2).max(5),
  rateCardSuggestions: z.array(z.object({
    contentType: z.string(),
    suggestedRate: z.string(),
    justification: z.string(),
  })).min(3).max(6),
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
    content: ["day-in-the-life", "behind-the-scenes", "lifestyle tips"]
  },
  fitness: {
    colors: ["energetic", "motivational", "bold"],
    voice: ["motivational", "encouraging", "results-driven"],
    content: ["workout routines", "transformation stories", "nutrition tips"]
  },
  tech: {
    colors: ["modern", "sleek", "professional"],
    voice: ["informative", "innovative", "analytical"],
    content: ["reviews", "tutorials", "tech news"]
  },
  beauty: {
    colors: ["aesthetic", "trendy", "vibrant"],
    voice: ["glamorous", "confident", "trend-setting"],
    content: ["tutorials", "product reviews", "GRWM"]
  },
  business: {
    colors: ["professional", "trustworthy", "sophisticated"],
    voice: ["authoritative", "knowledgeable", "strategic"],
    content: ["educational", "case studies", "industry insights"]
  }
};

export async function generateBrandKit(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Get user's onboarding data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      role: true,
      // We need to add these fields to store signup data
      // For now, we'll use the form data
    }
  });

  const parsed = InputSchema.parse({
    brandName: formData.get("brandName")?.toString() || user?.name || undefined,
    customVibe: formData.get("customVibe")?.toString(),
    customAudience: formData.get("customAudience")?.toString(),
    selectedVibes: formData.getAll("selectedVibes").map(v => v.toString()),
    selectedAudiences: formData.getAll("selectedAudiences").map(a => a.toString()),
  });

  // For now, extract from form data - later we'll get from signup data
  const creatorType = formData.get("creatorType")?.toString() || "youtuber";
  const niches = formData.getAll("niches").map(n => n.toString()) || ["lifestyle"];
  const audienceSize = formData.get("audienceSize")?.toString() || "macro";

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

  const system = `You are an expert brand strategist specializing in creator economy and influencer marketing. 

Create a comprehensive brand kit that includes:
- tagline: A memorable, platform-appropriate tagline
- palette: 5-8 hex colors optimized for ${platforms.join("/")} content
- voice: Brand voice guidelines with attributes, dos, donts, tone, and personality traits
- logoPrompts: 4-6 detailed prompts for AI logo generation
- contentTemplates: Platform-specific content templates for ${platforms.join(", ")}
- rateCardSuggestions: Realistic pricing for ${audienceSize} creators in ${primaryNiche}

Return ONLY valid JSON. No markdown, no explanations.

Consider:
- Platform algorithms favor ${nicheData.colors.join(", ")} visuals
- ${primaryNiche} audience expects ${nicheData.voice.join(", ")} communication
- ${rateData.description} typically range from $${rateData.base}-${rateData.base * 3}
- Content should align with ${nicheData.content.join(", ")} formats`;

  const user_prompt = `Creator Profile:
- Type: ${creatorType} 
- Platforms: ${platforms.join(", ")}
- Niches: ${niches.join(", ")}
- Audience Size: ${audienceSize} (${rateData.description})
- Brand Name: ${parsed.brandName || "Personal Brand"}
- Style/Vibe: ${vibeText}
- Target Audience: ${audienceText}

Generate a brand kit that will help this creator:
1. Stand out on ${platforms.join("/")}
2. Appeal to ${audienceText}
3. Command appropriate rates for their ${audienceSize} audience
4. Create consistent ${primaryNiche} content`;

  try {
    const content = await chatJSON({ 
      system, 
      user: user_prompt, 
      model: "gpt-4o" // Use the more powerful model for better results
    });
    
    const data = PayloadSchema.parse(JSON.parse(content));

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
        // We'll need to extend the schema to store these new fields
        // contentTemplates: data.contentTemplates,
        // rateCardSuggestions: data.rateCardSuggestions,
      },
    });

    redirect("/onboarding");
  } catch (error) {
    console.error("Brand kit generation error:", error);
    throw new Error("Failed to generate brand kit. Please try again.");
  }
}