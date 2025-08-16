"use client";

import { useState } from "react";
import { Sparkles, Check, Rocket, ExternalLink, ArrowRight, Copy, Share2, Globe, Palette, Target } from "lucide-react";
import { completeOnboarding } from "./actions";
import Link from "next/link";

export default function OnboardingDone() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // This would come from your session/user data
  const userMediaKitUrl = "https://orbiq.co/u/yourhandle";
  const achievements = [
    {
      icon: Globe,
      title: "Professional Media Kit",
      description: "Live and ready to share with brands",
      status: "completed"
    },
    {
      icon: Palette,
      title: "AI Brand Kit Generated",
      description: "Colors, voice, and logo concepts created",
      status: "completed"
    },
    {
      icon: Target,
      title: "Workspace Created",
      description: "Your creator hub is set up and ready",
      status: "completed"
    }
  ];

  const copyMediaKitUrl = () => {
    navigator.clipboard.writeText(userMediaKitUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      await completeOnboarding(formData);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl text-center">
            
            {/* Success Animation */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Rocket className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                🎉 You're all set!
              </h1>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                Your Orbiq workspace is ready to help you build your creator brand and land amazing partnerships.
              </p>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{achievement.title}</h3>
                    <p className="text-sm text-purple-200 mb-3">{achievement.description}</p>
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Complete</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Media Kit Sharing */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Share2 className="w-6 h-6 text-purple-300" />
                <h3 className="text-lg font-semibold text-white">Share Your Media Kit</h3>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <p className="text-purple-300 font-mono text-sm break-all">{userMediaKitUrl}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={copyMediaKitUrl}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy URL"}
                </button>
                
                <Link
                  href={userMediaKitUrl}
                  target="_blank"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Media Kit
                </Link>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-left mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">What's next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-400 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">Customize Your Brand Kit</h4>
                      <p className="text-sm text-purple-200">Fine-tune colors, voice, and generate logo concepts</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-400 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">Share Your Media Kit</h4>
                      <p className="text-sm text-purple-200">Start getting brand partnership inquiries</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-yellow-400 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">Create Campaigns</h4>
                      <p className="text-sm text-purple-200">Manage brand partnerships and deliverables</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-400 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">Track Your Growth</h4>
                      <p className="text-sm text-purple-200">Monitor earnings and partnership performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/brand"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                <Palette className="w-5 h-5" />
                Customize Brand Kit
              </Link>
              
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Branding */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex items-center justify-center gap-3 text-purple-300">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm">Welcome to Orbiq - Let's build something amazing together</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}