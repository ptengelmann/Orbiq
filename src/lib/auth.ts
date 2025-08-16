// src/lib/auth.ts
import type { DefaultSession, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { compare } from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "CREATOR" | "AGENCY" | "ADMIN";
    } & DefaultSession["user"];
  }
  interface User {
    role: "CREATOR" | "AGENCY" | "ADMIN";
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1), // Allow any length for login
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 90, // 90 days
    updateAge: 60 * 60 * 24, // refresh cookie at most once/day
  },
  jwt: { maxAge: 60 * 60 * 24 * 90 },

  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Authorize attempt for:", credentials?.email);
          
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) {
            console.log("Invalid credentials format");
            return null;
          }

          const { email, password } = parsed.data;
          
          const user = await prisma.user.findUnique({ 
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              passwordHash: true,
            }
          });
          
          console.log("User found:", user ? "Yes" : "No");
          
          if (!user || !user.passwordHash) {
            console.log("User not found or no password hash");
            return null;
          }

          const passwordMatch = await compare(password, user.passwordHash);
          console.log("Password match:", passwordMatch);
          
          if (!passwordMatch) {
            console.log("Invalid password");
            return null;
          }

          console.log("Authentication successful for:", user.email);
          
          return {
            id: user.id,
            email: user.email ?? undefined,
            name: user.name ?? undefined,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as any) ?? "CREATOR";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "CREATOR";
      }
      return token;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
  },
  
  debug: process.env.NODE_ENV === "development",
};