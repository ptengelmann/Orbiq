// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Sparkles, 
  Globe, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Copy,
  ExternalLink,
  Users,
  Target,
  BarChart3
} from "lucide-react";

async function CreatorDashboard({ userData, analytics, latestBrandKit, latestMediaKit }: any) {
  // Calculate completion status
  const hasProfile = userData.creatorType && userData.niches?.length > 0;
  const hasBrandKit = !!latestBrandKit;
  const hasMediaKit = !!latestMediaKit;
  const completionItems = [
    { label: "Creator profile", completed: hasProfile, link: "/onboarding" },
    { label: "Brand kit generated", completed: hasBrandKit, link: "/onboarding/steps/brand" },
    { label: "Media kit published", completed: hasMediaKit, link: "/onboarding/steps/mediakit" },
  ];
  const completionPercentage = Math.round((completionItems.filter(item => item.completed).length / completionItems.length) * 100);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userData.name}!</h1>
          <p className="text-gray-600 capitalize">
            {userData.creatorType} • {userData.audienceSize} audience • {userData.niches?.join(", ")}
          </p>
        </div>
        
        {latestMediaKit && (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
            <Globe className="w-5 h-5 text-green-600" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-green-900">Your Media Kit</p>
              <p className="text-xs text-green-700 font-mono truncate">orbiq.co/u/{latestMediaKit.handle}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-green-100 rounded">
                <Copy className="w-4 h-4 text-green-600" />
              </button>
              <Link href={`https://orbiq.co/u/${latestMediaKit.handle}`} target="_blank" className="p-1 hover:bg-green-100 rounded">
                <ExternalLink className="w-4 h-4 text-green-600" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Activation Checklist (if not complete) */}
      {completionPercentage < 100 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-bold">Complete Your Activation</h2>
                <p className="text-orange-100">You're {completionPercentage}% done - finish to start getting collaborations</p>
              </div>
            </div>
            <div className="text-3xl font-bold">{completionPercentage}%</div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {completionItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center gap-3">
                  {item.completed ? 
                    <CheckCircle2 className="w-5 h-5 text-green-300" /> : 
                    <div className="w-5 h-5 border-2 border-white/30 rounded-full" />
                  }
                  <span className="text-sm">{item.label}</span>
                </div>
                {!item.completed && (
                  <Link href={item.link} className="text-white/80 hover:text-white text-sm underline">
                    Complete
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{analytics.mediaKitViews}</h3>
          <p className="text-sm text-gray-600">Media kit views</p>
          <p className="text-xs text-green-600 mt-1">+12% this week</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-purple-600 text-sm font-medium">New</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{analytics.inquiries}</h3>
          <p className="text-sm text-gray-600">Brand inquiries</p>
          <p className="text-xs text-purple-600 mt-1">3 this week</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <Calendar className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{analytics.activeCampaigns}</h3>
          <p className="text-sm text-gray-600">Active campaigns</p>
          <p className="text-xs text-gray-500 mt-1">2 due this week</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <BarChart3 className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${analytics.monthlyEarnings}</h3>
          <p className="text-sm text-gray-600">Earnings MTD</p>
          <p className="text-xs text-yellow-600 mt-1">+18% vs last month</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column - Recent Activity & Next Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Next Deadlines */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Next Deadlines</h2>
              <Link href="/dashboard/campaigns" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View all →
              </Link>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">TechBrand Campaign - Final Video</p>
                  <p className="text-sm text-gray-600">Due tomorrow, Dec 15</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Urgent</span>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">FitnessApp - Instagram Posts</p>
                  <p className="text-sm text-gray-600">Due Dec 18</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">This week</span>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">BeautyBrand - Product Review</p>
                  <p className="text-sm text-gray-600">Due Dec 22</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Next week</span>
              </div>
            </div>
          </div>

          {/* Recent Collab Threads */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Collaboration Threads</h2>
              <Link href="/dashboard/opportunities" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View inbox →
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">TechStartup Inc.</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">New</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Product launch campaign for AI productivity tool...</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">FashionBrand Co.</p>
                  <p className="text-sm text-gray-600 mb-2">Summer collection collaboration opportunity...</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Brand Kit & Quick Actions */}
        <div className="space-y-6">
          
          {/* Brand Kit Preview */}
          {latestBrandKit && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Your Brand</h2>
                <Link href="/dashboard/brand" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Edit →
                </Link>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Colors</p>
                  <div className="flex gap-2">
                    {latestBrandKit.palette.slice(0, 4).map((color: string, i: number) => (
                      <div key={i} className="w-8 h-8 rounded-lg border-2 border-white shadow-sm" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Voice</p>
                  <div className="flex flex-wrap gap-2">
                    {(latestBrandKit.voice as any)?.attributes?.slice(0, 3).map((attr: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-sm text-purple-700 font-medium">{latestBrandKit.tagline}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/dashboard/opportunities" className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Mail className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Check Opportunities</p>
                  <p className="text-xs text-gray-600">3 new brand inquiries</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
              
              <Link href="/dashboard/campaigns/new" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Target className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Start Campaign</p>
                  <p className="text-xs text-gray-600">Turn brief into project</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
              
              <Link href="/dashboard/brand" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Update Brand Kit</p>
                  <p className="text-xs text-gray-600">Refresh your identity</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return <div>Please sign in</div>;
  }

  // Get comprehensive user data
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      brandKits: {
        orderBy: { createdAt: "desc" },
        take: 1
      },
      mediaKits: {
        orderBy: { createdAt: "desc" },
        take: 1
      },
      campaigns: {
        orderBy: { createdAt: "desc" },
        take: 3
      }
    }
  });

  if (!userData) return <div>User not found</div>;

  const latestBrandKit = userData.brandKits[0];
  const latestMediaKit = userData.mediaKits[0];

  // Mock analytics (replace with real data later)
  const analytics = {
    mediaKitViews: latestMediaKit ? Math.floor(Math.random() * 150) + 50 : 0,
    inquiries: Math.floor(Math.random() * 8) + 2,
    activeCampaigns: userData.campaigns.length || 2,
    monthlyEarnings: Math.floor(Math.random() * 2500) + 500
  };

  // Route based on role
  if (userData.role === "AGENCY") {
    // TODO: Create agency dashboard
    return <div className="p-6">Agency dashboard coming soon...</div>;
  }

  // Default to creator dashboard
  return <CreatorDashboard 
    userData={userData} 
    analytics={analytics} 
    latestBrandKit={latestBrandKit} 
    latestMediaKit={latestMediaKit} 
  />;
}