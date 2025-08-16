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
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 90, // 90 days
    updateAge: 60 * 60 * 24,   // refresh cookie at most once/day
  },
  jwt: { maxAge: 60 * 60 * 24 * 90 },

  providers: [
    Credentials({
      name: "Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          role: user.role,
        };
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
      if (user) token.role = (user as any).role ?? "CREATOR";
      return token;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
  },
};
