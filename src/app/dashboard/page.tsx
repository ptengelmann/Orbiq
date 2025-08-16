// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Sparkles, 
  Globe, 
  TrendingUp, 
  Users, 
  DollarSign, 
  FileText, 
  Palette, 
  ExternalLink,
  Copy,
  Plus,
  Calendar,
  Mail,
  BarChart3,
  Target,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Star,
  Flame,
  Crown,
  Award,
  Briefcase,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingDown
} from "lucide-react";

async function AgencyDashboard({ userData, analytics }: any) {
  const agencyStats = {
    totalCreators: 12,
    activeCreators: 8,
    pendingBriefs: 5,
    activeCampaigns: 15,
    monthlyRevenue: 45000,
    collections: 8500,
  };

  const recentBriefs = [
    { id: 1, brand: "TechCorp", campaign: "Product Launch", budget: "$15,000", status: "New", urgency: "High", creator: "Sarah Chen" },
    { id: 2, brand: "FashionBrand", campaign: "Summer Collection", budget: "$8,000", status: "In Review", urgency: "Medium", creator: "Mike Rodriguez" },
    { id: 3, brand: "FitnessApp", campaign: "App Promotion", budget: "$12,000", status: "Proposal Sent", urgency: "Low", creator: "Emma Wilson" },
  ];

  const topCreators = [
    { name: "Sarah Chen", type: "YouTuber", audience: "150K", earnings: "$12,500", status: "Available", niche: "Tech", campaigns: 3 },
    { name: "Mike Rodriguez", type: "TikToker", audience: "89K", earnings: "$8,900", status: "Busy", niche: "Fitness", campaigns: 2 },
    { name: "Emma Wilson", type: "Instagrammer", audience: "200K", earnings: "$15,200", status: "Available", niche: "Beauty", campaigns: 4 },
    { name: "Alex Thompson", type: "Podcaster", audience: "50K", earnings: "$6,800", status: "Available", niche: "Business", campaigns: 1 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Hero Section with Advanced Metrics */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Agency Command Center
              </h1>
              <p className="text-xl text-purple-200">
                Managing {agencyStats.totalCreators} creators • ${agencyStats.monthlyRevenue.toLocaleString()} monthly revenue
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{Math.round((agencyStats.activeCreators / agencyStats.totalCreators) * 100)}%</div>
                <div className="text-sm text-purple-300">Active Rate</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{agencyStats.activeCampaigns}</div>
                <div className="text-sm text-purple-300">Live Campaigns</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{agencyStats.pendingBriefs}</div>
                <div className="text-sm text-purple-300">Pending Briefs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Performance Metrics */}
      <div className="grid lg:grid-cols-4 gap-6">
        {[
          { 
            stage: "New Leads", 
            count: 23, 
            value: "$125K", 
            trend: "+12%", 
            color: "from-blue-500 to-cyan-400", 
            icon: Target,
            description: "Potential new clients in pipeline"
          },
          { 
            stage: "Active Proposals", 
            count: 8, 
            value: "$89K", 
            trend: "+8%", 
            color: "from-yellow-500 to-orange-400", 
            icon: FileText,
            description: "Proposals sent to brands awaiting response"
          },
          { 
            stage: "Running Campaigns", 
            count: 15, 
            value: "$245K", 
            trend: "+24%", 
            color: "from-green-500 to-emerald-400", 
            icon: Zap,
            description: "Active campaigns in production"
          },
          { 
            stage: "Pending Collections", 
            count: 6, 
            value: "$67K", 
            trend: "+5%", 
            color: "from-purple-500 to-pink-400", 
            icon: Crown,
            description: "Completed work awaiting payment"
          },
        ].map((stage, index) => {
          const Icon = stage.icon;
          return (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" style={{background: `linear-gradient(to right, ${stage.color.split(' ')[1]}, ${stage.color.split(' ')[3]})`}}></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stage.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-green-400 text-sm font-medium flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stage.trend}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stage.count}</h3>
                <p className="text-white font-medium text-lg mb-2">{stage.stage}</p>
                <p className="text-2xl font-bold text-purple-200 mb-2">{stage.value}</p>
                <p className="text-purple-300 text-xs">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column - Recent Briefs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Briefs */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Recent Brand Briefs</h2>
              </div>
              <Link href="/dashboard/briefs" className="text-purple-300 hover:text-white text-sm font-medium transition-colors">
                View all →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentBriefs.map((brief) => (
                <div key={brief.id} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer border border-white/10 hover:border-white/20">
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      brief.urgency === 'High' ? 'bg-red-400' :
                      brief.urgency === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white">{brief.brand}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          brief.status === 'New' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                          brief.status === 'In Review' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' : 'bg-green-500/20 text-green-300 border border-green-400/30'
                        }`}>
                          {brief.status}
                        </span>
                      </div>
                      <p className="text-purple-200 mb-1">{brief.campaign}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-white">{brief.budget}</p>
                        <p className="text-sm text-purple-300">Assigned to: {brief.creator}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">Pipeline Health</h3>
                  <p className="text-blue-200 text-sm">Strong month with consistent flow</p>
                </div>
                <div className="text-2xl font-bold text-green-400">+24%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Creator Performance */}
        <div className="space-y-6">
          
          {/* Top Performing Creators */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h2 className="text-lg font-bold text-white">Top Performers</h2>
              </div>
              <Link href="/dashboard/roster" className="text-purple-300 hover:text-white text-sm font-medium transition-colors">
                View roster →
              </Link>
            </div>
            
            <div className="space-y-4">
              {topCreators.map((creator, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                    {creator.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white truncate">{creator.name}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        creator.status === 'Available' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {creator.status}
                      </span>
                    </div>
                    <p className="text-xs text-purple-200 mb-1">
                      {creator.type} • {creator.audience} • {creator.niche}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-green-400">{creator.earnings}</p>
                      <p className="text-xs text-purple-300">{creator.campaigns} campaigns</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-lg font-bold text-white">Quick Actions</h2>
            </div>
            
            <div className="space-y-3">
              {[
                { 
                  title: "Review New Briefs", 
                  subtitle: `${agencyStats.pendingBriefs} pending review`, 
                  href: "/dashboard/briefs", 
                  icon: FileText, 
                  color: "from-blue-500 to-cyan-500",
                  badge: agencyStats.pendingBriefs.toString()
                },
                { 
                  title: "Start New Campaign", 
                  subtitle: "Multi-creator project", 
                  href: "/dashboard/campaigns/new", 
                  icon: Target, 
                  color: "from-green-500 to-emerald-500"
                },
                { 
                  title: "Invite Creator", 
                  subtitle: "Expand your roster", 
                  href: "/dashboard/roster/invite", 
                  icon: Users, 
                  color: "from-purple-500 to-pink-500"
                },
                { 
                  title: "View Analytics", 
                  subtitle: "Performance reports", 
                  href: "/dashboard/analytics", 
                  icon: BarChart3, 
                  color: "from-yellow-500 to-orange-500"
                }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} href={action.href} className="group block">
                    <div className={`p-4 bg-gradient-to-r ${action.color}/20 hover:${action.color}/30 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200 transform hover:-translate-y-1`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{action.title}</h3>
                            {action.badge && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{action.badge}</span>
                            )}
                          </div>
                          <p className="text-purple-200 text-xs">{action.subtitle}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function CreatorDashboard({ userData, analytics, latestBrandKit, latestMediaKit }: any) {
  const hasProfile = userData.creatorType && userData.niches?.length > 0;
  const hasBrandKit = !!latestBrandKit;
  const hasMediaKit = !!latestMediaKit;
  const completionPercentage = Math.round(
    ((hasProfile ? 1 : 0) + (hasBrandKit ? 1 : 0) + (hasMediaKit ? 1 : 0)) / 3 * 100
  );

  return (
    <div className="p-8 space-y-8">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl font-bold text-white">{userData.name?.charAt(0) || "U"}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    {userData.name}
                  </h1>
                  <p className="text-purple-200 capitalize flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {userData.creatorType} • {userData.audienceSize} audience
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {userData.niches?.map((niche: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 rounded-full text-sm border border-purple-400/30">
                    #{niche}
                  </span>
                ))}
              </div>

              {/* Quick stats bar */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-white">{analytics.mediaKitViews}</div>
                  <div className="text-xs text-purple-300">Profile Views</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-green-400">{analytics.inquiries}</div>
                  <div className="text-xs text-purple-300">New Inquiries</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-yellow-400">${analytics.monthlyEarnings}</div>
                  <div className="text-xs text-purple-300">This Month</div>
                </div>
              </div>
            </div>
            
            {latestMediaKit && (
              <div className="lg:w-80">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-green-300" />
                    <div>
                      <h3 className="font-bold text-white">Media Kit Live</h3>
                      <p className="text-green-200 text-sm">Share with brands</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 rounded-xl p-4 mb-4">
                    <p className="text-green-200 font-mono text-sm">orbiq.co/u/{latestMediaKit.handle}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-green-500/30 hover:bg-green-500/40 text-green-200 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <Link href={`https://orbiq.co/u/${latestMediaKit.handle}`} target="_blank" className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activation Progress (if incomplete) */}
      {completionPercentage < 100 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 to-red-600/30 rounded-2xl blur-2xl"></div>
          <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Complete Your Setup</h2>
                  <p className="text-orange-100">Unlock full platform potential</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{completionPercentage}%</div>
                <div className="text-orange-200 text-sm">Complete</div>
              </div>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-1000"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {[
                { label: "Creator profile", completed: hasProfile, link: "/onboarding" },
                { label: "Brand kit generated", completed: hasBrandKit, link: "/onboarding/steps/brand" },
                { label: "Media kit published", completed: hasMediaKit, link: "/onboarding/steps/mediakit" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    {item.completed ? 
                      <CheckCircle2 className="w-5 h-5 text-green-300" /> : 
                      <div className="w-5 h-5 border-2 border-white/40 rounded-full"></div>
                    }
                    <span className="text-sm text-white">{item.label}</span>
                  </div>
                  {!item.completed && (
                    <Link href={item.link} className="text-white/80 hover:text-white text-sm underline transition-colors">
                      Complete
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {[
          { 
            title: "Profile Performance", 
            value: analytics.mediaKitViews, 
            change: "+12%", 
            subtitle: "Views this month",
            icon: Eye,
            color: "from-blue-500 to-cyan-400",
            trend: "up"
          },
          { 
            title: "Brand Interest", 
            value: analytics.inquiries, 
            change: "+5 new", 
            subtitle: "Collaboration requests",
            icon: Heart,
            color: "from-pink-500 to-rose-400",
            trend: "up"
          },
          { 
            title: "Active Projects", 
            value: analytics.activeCampaigns, 
            change: "2 due soon", 
            subtitle: "Campaigns in progress",
            icon: Briefcase,
            color: "from-green-500 to-emerald-400",
            trend: "neutral"
          },
          { 
            title: "Monthly Revenue", 
            value: `$${analytics.monthlyEarnings}`, 
            change: "+18%", 
            subtitle: "Estimated earnings",
            icon: Crown,
            color: "from-yellow-500 to-orange-400",
            trend: "up"
          }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl`}></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-sm font-medium flex items-center gap-1 ${
                    metric.trend === 'up' ? 'text-green-400' : 
                    metric.trend === 'down' ? 'text-red-400' : 'text-purple-300'
                  }`}>
                    {metric.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                    {metric.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                    {metric.trend === 'neutral' && <Clock className="w-4 h-4" />}
                    {metric.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                <p className="text-purple-200 text-sm mb-1">{metric.title}</p>
                <p className="text-purple-300 text-xs">{metric.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-7 gap-8">
        
        {/* Left Section - Activity Feed */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Priority Deadlines */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl font-bold text-white">Priority Deadlines</h2>
              </div>
              <Link href="/dashboard/campaigns" className="text-purple-300 hover:text-white transition-colors text-sm font-medium">
                View all →
              </Link>
            </div>
            
            <div className="space-y-4">
              {[
                { project: "TechBrand Campaign", task: "Final video edit", due: "Tomorrow", urgency: "critical", progress: 85 },
                { project: "FitnessApp Collab", task: "Instagram posts", due: "3 days", urgency: "high", progress: 60 },
                { project: "BeautyBrand Review", task: "Product photos", due: "1 week", urgency: "medium", progress: 30 },
              ].map((item, index) => (
                <div key={index} className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                  item.urgency === 'critical' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/40' :
                  item.urgency === 'high' ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-400/40' :
                  'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/40'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white">{item.project}</h3>
                      <p className="text-sm text-purple-200">{item.task}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">Due {item.due}</div>
                      <div className="text-xs text-purple-300">{item.progress}% complete</div>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        item.urgency === 'critical' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                        item.urgency === 'high' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' :
                        'bg-gradient-to-r from-blue-400 to-purple-400'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Stream */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <Link href="/dashboard/opportunities" className="text-purple-300 hover:text-white transition-colors text-sm font-medium">
                View inbox →
              </Link>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  type: "inquiry", 
                  brand: "TechStartup Inc.", 
                  message: "Interested in product launch campaign", 
                  time: "2h ago", 
                  avatar: "T",
                  status: "new"
                },
                { 
                  type: "approval", 
                  brand: "FashionBrand", 
                  message: "Approved your content proposal", 
                  time: "5h ago", 
                  avatar: "F",
                  status: "approved"
                },
                { 
                  type: "payment", 
                  brand: "BeautyBrand", 
                  message: "Payment processed - $2,500", 
                  time: "1d ago", 
                  avatar: "B",
                  status: "paid"
                },
                { 
                  type: "message", 
                  brand: "FitnessApp", 
                  message: "Requested revision on video script", 
                  time: "2d ago", 
                  avatar: "F",
                  status: "revision"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer group border border-transparent hover:border-white/20">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    activity.status === 'new' ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                    activity.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                    activity.status === 'paid' ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                    'bg-gradient-to-r from-purple-500 to-pink-400'
                  } text-white shadow-lg`}>
                    {activity.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{activity.brand}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === 'new' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                        activity.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                        activity.status === 'paid' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                        'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-purple-200 text-sm mb-1">{activity.message}</p>
                    <p className="text-purple-400 text-xs">{activity.time}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Brand Kit & Actions */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Brand Kit Showcase */}
          {latestBrandKit && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Palette className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Your Brand</h2>
                </div>
                <Link href="/dashboard/brand" className="text-purple-300 hover:text-white transition-colors text-sm font-medium">
                  Edit →
                </Link>
              </div>
              
              {/* Brand Colors Display */}
              <div className="mb-6">
                <p className="text-sm font-medium text-purple-200 mb-3">Brand Colors</p>
                <div className="flex gap-2 mb-4">
                  {latestBrandKit.palette.slice(0, 5).map((color: string, i: number) => (
                    <div key={i} className="relative group">
                      <div 
                        className="w-10 h-10 rounded-xl shadow-lg cursor-pointer transform group-hover:scale-110 transition-transform duration-200 ring-2 ring-white/20"
                        style={{ backgroundColor: color }}
                      />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {color}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Brand Voice */}
              <div className="mb-6">
                <p className="text-sm font-medium text-purple-200 mb-3">Brand Voice</p>
                <div className="flex flex-wrap gap-2">
                  {(latestBrandKit.voice as any)?.attributes?.slice(0, 3).map((attr: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 rounded-full text-xs border border-purple-400/30">
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Tagline */}
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                <p className="text-sm font-medium text-purple-100 italic">"{latestBrandKit.tagline}"</p>
              </div>
            </div>
          )}

          {/* Quick Action Hub */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            
            <div className="space-y-3">
              {[
                { 
                  title: "Check New Opportunities", 
                  subtitle: "3 brand inquiries waiting", 
                  href: "/dashboard/opportunities", 
                  icon: Mail, 
                  color: "from-purple-500 to-pink-500",
                  badge: "3"
                },
                { 
                  title: "Start New Campaign", 
                  subtitle: "Turn brief into project", 
                  href: "/dashboard/campaigns/new", 
                  icon: Target, 
                  color: "from-green-500 to-emerald-500"
                },
                { 
                  title: "Update Rate Card", 
                  subtitle: "Adjust your pricing", 
                  href: "/dashboard/rate-card", 
                  icon: DollarSign, 
                  color: "from-yellow-500 to-orange-500"
                },
                { 
                  title: "View Analytics", 
                  subtitle: "Performance insights", 
                  href: "/dashboard/analytics", 
                  icon: BarChart3, 
                  color: "from-blue-500 to-cyan-500"
                }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} href={action.href} className="group block">
                    <div className={`p-4 bg-gradient-to-r ${action.color}/20 hover:${action.color}/30 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{action.title}</h3>
                            {action.badge && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{action.badge}</span>
                            )}
                          </div>
                          <p className="text-purple-200 text-xs">{action.subtitle}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* AI Assistant */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">AI Assistant</h3>
                  <p className="text-purple-200 text-xs">Your creative partner</p>
                </div>
              </div>
              
              <p className="text-purple-100 text-sm mb-4">
                Ready to help with content ideas, campaign strategies, and brand optimization.
              </p>
              
              <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                Chat with AI
              </button>
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
    return <AgencyDashboard userData={userData} analytics={analytics} />;
  }

  // Default to creator dashboard
  return <CreatorDashboard 
    userData={userData} 
    analytics={analytics} 
    latestBrandKit={latestBrandKit} 
    latestMediaKit={latestMediaKit} 
  />;
}