import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(60),
  password: z.string().min(6),
  role: z.enum(["CREATOR", "AGENCY"]),
  creatorType: z.string().optional(),
  agencyType: z.string().optional(),
  niches: z.array(z.string()).optional(),
  audienceSize: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hash(validatedData.password, 12);

    // Create user with enhanced profile data
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        role: validatedData.role,
        passwordHash,
        // Store onboarding data as JSON for now
        // You might want to create separate tables for this
        onboardingData: {
          creatorType: validatedData.creatorType,
          agencyType: validatedData.agencyType,
          niches: validatedData.niches,
          audienceSize: validatedData.audienceSize,
          completedAt: new Date().toISOString()
        } as any
      },
    });

    // Return success (don't include sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}