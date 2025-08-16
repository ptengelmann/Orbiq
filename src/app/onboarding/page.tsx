import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingIndex() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/sign-in");

  const [org, brand, media, me] = await Promise.all([
    prisma.membership.findFirst({ where: { userId: session.user.id } }),
    prisma.brandKit.findFirst({ where: { userId: session.user.id } }),
    prisma.mediaKit.findFirst({ where: { userId: session.user.id } }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { onboardingCompleted: true, role: true } }),
  ]);

  if (me?.onboardingCompleted) redirect("/dashboard");
  if (!org) redirect("/onboarding/steps/workspace");
  if (!brand) redirect("/onboarding/steps/brand");
  if (!media) redirect("/onboarding/steps/mediakit");
  redirect("/onboarding/done");
}
