// src/app/onboarding/steps/brand/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Sparkles, Palette, Target, Wand2, ArrowRight, Brain, Zap, Users, TrendingUp } from "lucide-react";
import { generateBrandKit } from "./actions";

const BRAND_VIBES = [
  { id: "minimal", label: "Minimal", desc: "Clean, simple, understated", color: "from-gray-400 to-gray-600" },
  { id: "bold", label: "Bold", desc: "Strong, confident, impactful", color: "from-red-500 to-pink-600" },
  { id: "playful", label: "Playful", desc: "Fun, energetic, creative", color: "from-yellow-400 to-orange-500" },
  { id: "elegant", label: "Elegant", desc: "Sophisticated, refined, luxury", color: "from-purple-500 to-indigo-600" },
  { id: "modern", label: "Modern", desc: "Contemporary, sleek, cutting-edge", color: "from-blue-500 to-cyan-500" },
  { id: "warm", label: "Warm", desc: "Friendly, approachable, welcoming", color: "from-orange-400 to-red-400" },
  { id: "edgy", label: "Edgy", desc: "Rebellious, unconventional, daring", color: "from-gray-700 to-black" },
  { id: "professional", label: "Professional", desc: "Serious, trustworthy, corporate", color: "from-blue-600 to-indigo-700" }
];

const AUDIENCE_TYPES = [
  { id: "gen-z", label: "Gen Z (18-24)", desc: "Digital natives, social media focused", icon: TrendingUp },
  { id: "millennials", label: "Millennials (25-40)", desc: "Career-focused, value-driven", icon: Users },
  { id: "parents", label: "Parents", desc: "Family-focused content consumers", icon: Users },
  { id: "professionals", label: "Young Professionals", desc: "Career and lifestyle focused", icon: Target },
  { id: "students", label: "Students", desc: "Educational and entertainment content", icon: Brain },
  { id: "entrepreneurs", label: "Entrepreneurs", desc: "Business and growth minded", icon: Zap },
];

export default function BrandStep() {
  const [formData, setFormData] = useState({
    brandName: "",
    customVibe: "",
    customAudience: ""
  });
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [useCustomInputs, setUseCustomInputs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Get real user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          setFormData(prev => ({ ...prev, brandName: profile.name || "" }));
        } else {
          // Fallback to mock data if API fails
          const mockProfile = {
            name: "Pedro",
            creatorType: "youtuber",
            niches: ["tech", "business"],
            audienceSize: "macro",
            role: "CREATOR"
          };
          setUserProfile(mockProfile);
          setFormData(prev => ({ ...prev, brandName: mockProfile.name || "" }));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Use mock data as fallback
        const mockProfile = {
          name: "Creator",
          creatorType: "youtuber", 
          niches: ["lifestyle"],
          audienceSize: "macro",
          role: "CREATOR"
        };
        setUserProfile(mockProfile);
        setFormData(prev => ({ ...prev, brandName: mockProfile.name || "" }));
      }
    }

    fetchUserProfile();
  }, []);

  const handleVibeToggle = (vibeId: string) => {
    setSelectedVibes(prev => 
      prev.includes(vibeId) 
        ? prev.filter(id => id !== vibeId)
        : [...prev, vibeId].slice(0, 3) // Max 3 vibes
    );
  };

  const handleAudienceToggle = (audienceId: string) => {
    setSelectedAudiences(prev => 
      prev.includes(audienceId) 
        ? prev.filter(id => id !== audienceId)
        : [...prev, audienceId].slice(0, 2) // Max 2 audiences
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("brandName", formData.brandName);
      
      // Use custom inputs or selected options
      if (useCustomInputs) {
        formDataToSend.append("customVibe", formData.customVibe);
        formDataToSend.append("customAudience", formData.customAudience);
      } else {
        selectedVibes.forEach(vibe => formDataToSend.append("selectedVibes", vibe));
        selectedAudiences.forEach(audience => formDataToSend.append("selectedAudiences", audience));
      }

      await generateBrandKit(formDataToSend);
    } catch (error) {
      console.error("Error creating brand kit:", error);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = useCustomInputs 
    ? formData.customVibe.trim().length >= 5 && formData.customAudience.trim().length >= 3
    : selectedVibes.length > 0 && selectedAudiences.length > 0;

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Info & Profile */}
        <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">Orbiq</span>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-purple-300">Step 2 of 4</span>
                <div className="flex-1 bg-white/10 rounded-full h-2 ml-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-1/2 transition-all duration-500 ease-out" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">AI is creating your brand kit</h2>
              <p className="text-lg text-purple-200">
                Based on your profile, our AI will generate colors, voice guidelines, logo concepts, and content templates.
              </p>
            </div>

            {/* User Profile Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-green-400" />
                <span className="font-semibold text-white">Your Creator Profile</span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-300">Creator Type:</span>
                  <span className="text-white capitalize">{userProfile.creatorType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Niches:</span>
                  <span className="text-white capitalize">{userProfile.niches?.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Audience Size:</span>
                  <span className="text-white capitalize">{userProfile.audienceSize}</span>
                </div>
              </div>
            </div>

            {/* AI Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-purple-400" />
                <span>Smart color palettes for your niche</span>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-pink-400" />
                <span>Voice guidelines for your audience</span>
              </div>
              <div className="flex items-center gap-3">
                <Wand2 className="w-5 h-5 text-yellow-400" />
                <span>Logo concepts for your platforms</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>Rate suggestions for your audience size</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Brand Customization */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Customize your brand</h3>
                <p className="text-purple-200">Fine-tune the AI generation with your preferences</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Brand name</label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                    placeholder="Your brand name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                </div>

                {/* Custom vs Preset Toggle */}
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setUseCustomInputs(!useCustomInputs)}
                    className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    {useCustomInputs ? "Use presets" : "Custom inputs"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {!useCustomInputs ? (
                  <>
                    {/* Brand Vibes */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-3">
                        Brand vibes ({selectedVibes.length}/3)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {BRAND_VIBES.map((vibe) => {
                          const isSelected = selectedVibes.includes(vibe.id);
                          const isDisabled = !isSelected && selectedVibes.length >= 3;
                          
                          return (
                            <button
                              key={vibe.id}
                              type="button"
                              onClick={() => handleVibeToggle(vibe.id)}
                              disabled={isDisabled}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                                isSelected
                                  ? "border-purple-400 bg-purple-500/20" 
                                  : isDisabled
                                  ? "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
                                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                              }`}
                            >
                              <div className={`w-8 h-2 rounded-full bg-gradient-to-r ${vibe.color} mb-2`} />
                              <div className="font-medium text-white text-sm">{vibe.label}</div>
                              <div className="text-xs text-purple-300">{vibe.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Target Audiences */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-3">
                        Target audiences ({selectedAudiences.length}/2)
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {AUDIENCE_TYPES.map((audience) => {
                          const Icon = audience.icon;
                          const isSelected = selectedAudiences.includes(audience.id);
                          const isDisabled = !isSelected && selectedAudiences.length >= 2;
                          
                          return (
                            <button
                              key={audience.id}
                              type="button"
                              onClick={() => handleAudienceToggle(audience.id)}
                              disabled={isDisabled}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center gap-3 ${
                                isSelected
                                  ? "border-purple-400 bg-purple-500/20" 
                                  : isDisabled
                                  ? "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
                                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                              }`}
                            >
                              <Icon className="w-5 h-5 text-purple-400" />
                              <div className="flex-1">
                                <div className="font-medium text-white text-sm">{audience.label}</div>
                                <div className="text-xs text-purple-300">{audience.desc}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Custom Vibe */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Brand style & vibe</label>
                      <textarea
                        value={formData.customVibe}
                        onChange={(e) => setFormData(prev => ({ ...prev, customVibe: e.target.value }))}
                        placeholder="Bold, modern, minimal, confident..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                      />
                    </div>

                    {/* Custom Audience */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Target audience</label>
                      <textarea
                        value={formData.customAudience}
                        onChange={(e) => setFormData(prev => ({ ...prev, customAudience: e.target.value }))}
                        placeholder="Gen Z creators, fitness enthusiasts, young professionals..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      AI is generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Generate Brand Kit
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}