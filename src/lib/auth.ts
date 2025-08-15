import type { DefaultSession, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

const credentialsSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["CREATOR", "AGENCY"]).optional(),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Dev Login",
      credentials: {
        email: { label: "Email", type: "text" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, name, role } = parsed.data;

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, name, role: (role ?? "CREATOR") as any },
          });
        }
        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
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
