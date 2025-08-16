// src/app/dashboard/layout.tsx
import AppShell from "@/components/AppShell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/sign-in");

  // Get user data for AppShell
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      creatorType: true,
      image: true,
      onboardingCompleted: true,
      mediaKits: {
        select: { handle: true },
        take: 1,
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!userData) redirect("/auth/sign-in");

  // Temporarily allow access even if onboarding not completed
  console.log("User onboarding status:", userData.onboardingCompleted);
  
  // Uncomment this line once onboarding data is showing properly:
  // if (!userData.onboardingCompleted) redirect("/onboarding");
  
  return <AppShell userData={userData}>{children}</AppShell>;
}