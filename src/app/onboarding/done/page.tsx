// src/app/onboarding/done/page.tsx
"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Sparkles, Copy, ExternalLink, ArrowRight, Palette, Globe, Brain } from "lucide-react";
import Link from "next/link";

export default function OnboardingDone() {
  const [mediaKitUrl, setMediaKitUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          
          // Get the user's media kit
          const mediaKitResponse = await fetch('/api/user/mediakit');
          if (mediaKitResponse.ok) {
            const mediaKit = await mediaKitResponse.json();
            setMediaKitUrl(`https://orbiq.co/u/${mediaKit.handle}`);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }

    fetchUserData();
  }, []);

  const copyMediaKitUrl = () => {
    navigator.clipboard.writeText(mediaKitUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="w-full max-w-2xl text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              🎉 You're all set!
            </h1>
            
            <p className="text-xl text-purple-200 mb-8">
              Your AI-powered creator workspace is ready to help you land better brand deals
            </p>
          </div>

          {/* What Was Created */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">What we created for you</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">AI Brand Kit</h3>
                <p className="text-sm text-purple-200">Custom colors, voice guidelines, and logo concepts</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Media Kit</h3>
                <p className="text-sm text-purple-200">Professional page for brand partnerships</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Workspace</h3>
                <p className="text-sm text-purple-200">Dashboard to manage campaigns and analytics</p>
              </div>
            </div>

            {/* Media Kit URL */}
            {mediaKitUrl && (
              <div className="bg-black/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <h3 className="font-semibold text-white">Your Media Kit is Live!</h3>
                    <p className="text-sm text-purple-200">Share this with brands to get collaborations</p>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-purple-300 font-mono text-sm break-all">{mediaKitUrl}</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={copyMediaKitUrl}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy URL"}
                  </button>
                  
                  <button
                    onClick={() => window.open(mediaKitUrl, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg rounded-lg text-white transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-white">Next steps</h2>
            
            <div className="text-left space-y-3">
              <div className="flex items-center gap-3 text-purple-200">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-300">1</div>
                <span>Share your media kit URL on social media and in your bio</span>
              </div>
              <div className="flex items-center gap-3 text-purple-200">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-300">2</div>
                <span>Check your dashboard to see inquiries from brands</span>
              </div>
              <div className="flex items-center gap-3 text-purple-200">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-300">3</div>
                <span>Turn brand briefs into campaigns with AI assistance</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Orbiq Branding */}
          <div className="flex items-center justify-center gap-3 mt-12 text-purple-300">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Orbiq</span>
          </div>
        </div>
      </div>
    </div>
  );
}