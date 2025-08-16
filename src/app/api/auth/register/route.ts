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
    console.log("Registration request body:", body);
    
    const validatedData = RegisterSchema.parse(body);
    console.log("Validated data:", validatedData);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      console.log("User already exists:", validatedData.email);
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hash(validatedData.password, 12);
    console.log("Password hashed successfully");

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        role: validatedData.role,
        passwordHash,
      },
    });

    console.log("User created successfully:", user.id);

    // Return success (don't include sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      console.log("Validation error:", error.issues);
      return NextResponse.json(
        { 
          error: "Invalid input data", 
          details: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    // Database connection error
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}