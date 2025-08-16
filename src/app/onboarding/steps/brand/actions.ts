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

// Enhanced fallback brand kits based on niche and creator type
const SMART_BRAND_KITS = {
  tech_youtuber: {
    tagline: "Demystifying Tech, One Video at a Time",
    palette: ["#667eea", "#764ba2", "#4a90e2", "#50e3c2", "#b4ec51", "#f093fb"],
    voice: {
      attributes: ["analytical", "innovative", "educational"],
      dos: ["Break down complex concepts", "Stay current with trends", "Engage with tech community"],
      donts: ["Oversimplify without context", "Ignore accessibility", "Promote unethical tech"]
    },
    logoPrompts: [
      "Modern tech logo with circuit elements",
      "Clean YouTube channel branding for tech reviewer",
      "Minimalist logo combining play button and tech iconography"
    ]
  },
  fitness_tiktoker: {
    tagline: "Transforming Lives Through Movement",
    palette: ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a8e6cf", "#ff8b94", "#ffd93d"],
    voice: {
      attributes: ["motivational", "energetic", "results-driven"],
      dos: ["Show real transformations", "Provide quick actionable tips", "Build supportive community"],
      donts: ["Promote unhealthy habits", "Body shame", "Give medical advice"]
    },
    logoPrompts: [
      "Dynamic fitness logo with movement lines",
      "TikTok optimized fitness brand mark",
      "Energetic logo combining dumbbells and social media elements"
    ]
  },
  beauty_instagrammer: {
    tagline: "Authentic Beauty, Authentic You",
    palette: ["#ff9a8b", "#a8edea", "#fed6e3", "#ffeaa7", "#dda0dd", "#98fb98"],
    voice: {
      attributes: ["glamorous", "inclusive", "trend-setting"],
      dos: ["Showcase diverse beauty", "Share honest product reviews", "Create aspirational content"],
      donts: ["Promote unrealistic standards", "Hide sponsorships", "Exclude different skin tones"]
    },
    logoPrompts: [
      "Elegant beauty logo with makeup brush elements",
      "Instagram-optimized beauty brand identity",
      "Sophisticated logo combining cosmetics and social media"
    ]
  },
  lifestyle_multi: {
    tagline: "Living Life, Sharing Stories",
    palette: ["#ffeaa7", "#fab1a0", "#e17055", "#6c5ce7", "#a29bfe", "#fd79a8"],
    voice: {
      attributes: ["authentic", "relatable", "inspiring"],
      dos: ["Share genuine moments", "Connect with audience personally", "Inspire positive change"],
      donts: ["Fake perfect life", "Overshare personal details", "Promote toxic positivity"]
    },
    logoPrompts: [
      "Versatile lifestyle brand logo",
      "Multi-platform optimized personal brand mark",
      "Clean logo reflecting authentic lifestyle content"
    ]
  },
  business_podcaster: {
    tagline: "Where Insights Meet Action",
    palette: ["#2d3748", "#4a5568", "#667eea", "#764ba2", "#f093fb", "#4ecdc4"],
    voice: {
      attributes: ["authoritative", "insightful", "strategic"],
      dos: ["Provide actionable advice", "Interview industry leaders", "Share data-driven insights"],
      donts: ["Give financial advice without expertise", "Make unrealistic promises", "Ignore ethical considerations"]
    },
    logoPrompts: [
      "Professional podcast logo with microphone elements",
      "Business-focused brand mark for audio content",
      "Executive-level logo combining sound waves and business iconography"
    ]
  }
};

// Niche-specific brand guidelines (fallback)
const NICHE_BRAND_MAP = {
  lifestyle: {
    colors: ["warm", "approachable", "instagram-friendly"],
    voice: ["authentic", "relatable", "inspiring"],
    palette: ["#ffeaa7", "#fab1a0", "#e17055", "#6c5ce7", "#a29bfe", "#fd79a8"],
    tagline: "Living Authentically, Inspiring Others"
  },
  fitness: {
    colors: ["energetic", "motivational", "bold"],
    voice: ["motivational", "encouraging", "results-driven"],
    palette: ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a8e6cf", "#ff8b94", "#ffd93d"],
    tagline: "Stronger Every Day"
  },
  tech: {
    colors: ["modern", "sleek", "professional"],
    voice: ["informative", "innovative", "analytical"],
    palette: ["#667eea", "#764ba2", "#4a90e2", "#50e3c2", "#b4ec51", "#f093fb"],
    tagline: "Innovation Through Technology"
  },
  beauty: {
    colors: ["aesthetic", "trendy", "vibrant"],
    voice: ["glamorous", "confident", "trend-setting"],
    palette: ["#ff9a8b", "#a8edea", "#fed6e3", "#ffeaa7", "#dda0dd", "#98fb98"],
    tagline: "Beauty Without Boundaries"
  },
  business: {
    colors: ["professional", "trustworthy", "sophisticated"],
    voice: ["authoritative", "knowledgeable", "strategic"],
    palette: ["#2d3748", "#4a5568", "#667eea", "#764ba2", "#f093fb", "#4ecdc4"],
    tagline: "Success Through Strategy"
  }
};

function generateSmartBrandKit(creatorType: string, primaryNiche: string, brandName: string, vibeText: string, platforms: string[]): BrandKitPayload {
  // Try to find a smart brand kit that matches creator type and niche
  const smartKey = `${primaryNiche}_${creatorType}` as keyof typeof SMART_BRAND_KITS;
  if (SMART_BRAND_KITS[smartKey]) {
    const smartKit = SMART_BRAND_KITS[smartKey];
    return {
      ...smartKit,
      tagline: brandName ? `${brandName} - ${smartKit.tagline}` : smartKit.tagline
    };
  }

  // Fallback to niche-based brand kit
  const nicheData = NICHE_BRAND_MAP[primaryNiche as keyof typeof NICHE_BRAND_MAP] || NICHE_BRAND_MAP.lifestyle;
  
  return {
    tagline: brandName ? `${brandName} - ${nicheData.tagline}` : nicheData.tagline,
    palette: nicheData.palette,
    voice: {
      attributes: nicheData.voice,
      dos: [`Be ${nicheData.voice[0]}`, `Share ${primaryNiche} content`, "Engage authentically with your audience"],
      donts: ["Don't be inauthentic", "Don't ignore your community", "Don't stray from your brand voice"]
    },
    logoPrompts: [
      `Modern ${primaryNiche} logo for ${creatorType}`,
      `${brandName || "Personal brand"} logo optimized for ${platforms[0]}`,
      `Clean and professional ${vibeText} design`,
      `${primaryNiche} brand mark with ${creatorType} aesthetic`
    ]
  };
}

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

    // Build vibe and audience strings
    const nicheData = NICHE_BRAND_MAP[primaryNiche as keyof typeof NICHE_BRAND_MAP] || NICHE_BRAND_MAP.lifestyle;
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

    let data: BrandKitPayload;

    // Try AI generation first, but always have fallback
    try {
      // Check if OpenAI API key exists and is valid
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
        console.log("Attempting AI generation...");
        
        const system = `You are a brand strategist for creators. Create a brand kit with ONLY these keys:
- tagline: A memorable tagline for this creator (personalized for their brand name if provided)
- palette: Array of 6 hex color codes that work well together
- voice: Object with attributes (array of 3-4 adjectives), dos (array of 3-4 action items), donts (array of 3-4 things to avoid)
- logoPrompts: Array of 3-4 specific logo description prompts for this creator type

Return ONLY valid JSON. No explanations.`;

        const user_prompt = `Creator: ${creatorType} on ${platforms.join(", ")}
Niches: ${niches.join(", ")}
Audience: ${audienceSize} audience interested in ${audienceText}
Brand Name: ${parsed.brandName || "Personal Brand"}
Desired Style: ${vibeText}

Create a personalized brand kit for this ${primaryNiche} ${creatorType}.`;

        const content = await chatJSON({ 
          system, 
          user: user_prompt, 
          model: "gpt-4o-mini"
        });
        
        console.log("AI response received:", content);
        
        // Parse and validate AI response
        const aiData = JSON.parse(content);
        data = PayloadSchema.parse(aiData);
        
        console.log("AI generation successful");
        
      } else {
        throw new Error("OpenAI API key not configured");
      }
    } catch (aiError) {
      console.log("AI generation failed, using smart fallback:", aiError);
      
      // Use smart fallback based on creator type and niche
      data = generateSmartBrandKit(creatorType, primaryNiche, parsed.brandName || "", vibeText, platforms);
      
      console.log("Smart fallback generated successfully");
    }

    console.log("Final brand kit data:", data);

    // Save to database
    const savedBrandKit = await prisma.brandKit.create({
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

    console.log("Brand kit saved successfully with ID:", savedBrandKit.id);
    
    // Redirect to next step
    redirect("/onboarding/steps/mediakit");
    
  } catch (error) {
    console.error("Brand kit generation error:", error);
    
    // Handle specific error types
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      throw new Error("Invalid data format. Please check your inputs.");
    }
    
    // Check if this is actually a successful redirect (Next.js throws on redirect)
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("NEXT_REDIRECT")) {
      console.log("Redirect successful, brand kit created");
      return; // Don't throw error for successful redirects
    }
    
    if (errorMessage?.includes("API key")) {
      throw new Error("AI service configuration error. Please contact support.");
    }
    
    // For any other error, try one more time with guaranteed fallback
    try {
      console.log("Attempting emergency fallback...");
      
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        throw new Error("Not authenticated");
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          creatorType: true,
          niches: true,
        }
      });

      if (!user) {
        throw new Error("User not found");
      }

      const creatorType = user.creatorType || "youtuber";
      const primaryNiche = (user.niches && user.niches.length > 0 ? user.niches[0] : "lifestyle");
      const platforms = CREATOR_PLATFORM_MAP[creatorType as keyof typeof CREATOR_PLATFORM_MAP] || ["Social Media"];
      
      const emergencyData = generateSmartBrandKit(creatorType, primaryNiche, user.name || "", "modern, professional", platforms);
      
      await prisma.brandKit.create({
        data: {
          userId: session.user.id,
          brandName: user.name,
          vibe: "modern, professional",
          audience: `${primaryNiche} enthusiasts`,
          tagline: emergencyData.tagline,
          palette: emergencyData.palette,
          voice: emergencyData.voice as any,
          logoPrompts: emergencyData.logoPrompts,
        },
      });

      console.log("Emergency fallback successful");
      redirect("/onboarding/steps/mediakit");
      
    } catch (finalError) {
      console.error("All fallbacks failed:", finalError);
      throw new Error("Unable to generate brand kit. Please try again or contact support.");
    }
  }
}