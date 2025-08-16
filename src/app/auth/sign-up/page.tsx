"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Check, Users, Zap, Star, Camera, Mic, Youtube, Instagram, Monitor, Globe, Eye, EyeOff, Sparkles, Dumbbell, Scissors, Gamepad2, ChefHat, Plane, Briefcase, GraduationCap, Drama, Target } from 'lucide-react';

const CREATOR_TYPES = [
  { 
    id: "youtuber", 
    label: "YouTuber", 
    desc: "Long-form video content",
    icon: Youtube,
    color: "from-red-500 to-red-600",
    audience: "1M+ subscribers avg"
  },
  { 
    id: "tiktoker", 
    label: "TikToker", 
    desc: "Short-form viral content",
    icon: Monitor,
    color: "from-pink-500 to-rose-600",
    audience: "500K+ followers avg"
  },
  { 
    id: "instagrammer", 
    label: "Instagram Creator", 
    desc: "Visual storytelling & lifestyle",
    icon: Instagram,
    color: "from-purple-500 to-pink-600",
    audience: "100K+ followers avg"
  },
  { 
    id: "streamer", 
    label: "Live Streamer", 
    desc: "Real-time interactive content",
    icon: Monitor,
    color: "from-purple-600 to-indigo-600",
    audience: "50K+ followers avg"
  },
  { 
    id: "podcaster", 
    label: "Podcaster", 
    desc: "Audio content & conversations",
    icon: Mic,
    color: "from-green-500 to-emerald-600",
    audience: "10K+ downloads avg"
  },
  { 
    id: "multi", 
    label: "Multi-Platform", 
    desc: "Cross-platform content strategy",
    icon: Globe,
    color: "from-blue-500 to-cyan-600",
    audience: "Various platforms"
  }
];

const AGENCY_TYPES = [
  { 
    id: "talent", 
    label: "Talent Management", 
    desc: "Manage creator rosters & partnerships",
    icon: Users,
    color: "from-indigo-500 to-purple-600",
    size: "5-50 creators avg"
  },
  { 
    id: "marketing", 
    label: "Influencer Marketing", 
    desc: "Brand campaign orchestration",
    icon: Zap,
    color: "from-orange-500 to-red-600",
    size: "Enterprise clients"
  },
  { 
    id: "media", 
    label: "Media Production", 
    desc: "Content creation & production",
    icon: Camera,
    color: "from-emerald-500 to-teal-600",
    size: "Full-service agency"
  }
];

const NICHES = [
  { id: "lifestyle", label: "Lifestyle", icon: Sparkles },
  { id: "fitness", label: "Fitness & Health", icon: Dumbbell },
  { id: "beauty", label: "Beauty & Fashion", icon: Scissors },
  { id: "tech", label: "Tech & Gaming", icon: Gamepad2 },
  { id: "food", label: "Food & Cooking", icon: ChefHat },
  { id: "travel", label: "Travel & Adventure", icon: Plane },
  { id: "business", label: "Business & Finance", icon: Briefcase },
  { id: "education", label: "Education & Learning", icon: GraduationCap },
  { id: "entertainment", label: "Entertainment", icon: Drama },
  { id: "other", label: "Other", icon: Target }
];

const AUDIENCE_SIZES = [
  { id: "micro", label: "Micro (1K-10K)", desc: "High engagement, niche audience" },
  { id: "macro", label: "Macro (10K-100K)", desc: "Growing influence, expanding reach" },
  { id: "mega", label: "Mega (100K-1M)", desc: "Significant reach, brand partnerships" },
  { id: "celebrity", label: "Celebrity (1M+)", desc: "Massive influence, premium rates" }
];

export default function SignUp() {
  const search = useSearchParams();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<"CREATOR" | "AGENCY" | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [audienceSize, setAudienceSize] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: search.get("email") ?? "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const callbackUrl = search.get("callbackUrl") || "/onboarding";
  const totalSteps = accountType === "CREATOR" ? 5 : 4;

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    
    switch(currentStep) {
      case 1:
        if (!accountType) newErrors.accountType = "Please select an account type";
        break;
      case 2:
        if (!selectedType) newErrors.selectedType = "Please select your type";
        break;
      case 3:
        if (accountType === "CREATOR") {
          if (selectedNiches.length === 0) newErrors.niches = "Select at least one niche";
        }
        break;
      case 4:
        if (accountType === "CREATOR") {
          if (!audienceSize) newErrors.audienceSize = "Please select your audience size";
        } else {
          // Agency account details
          if (!formData.name.trim()) newErrors.name = "Name is required";
          if (!formData.email.trim()) newErrors.email = "Email is required";
          if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
          if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
          if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        }
        break;
      case 5:
        // Creator account details
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleNicheToggle = (nicheId: string) => {
    setSelectedNiches(prev => 
      prev.includes(nicheId) 
        ? prev.filter(id => id !== nicheId)
        : [...prev, nicheId].slice(0, 3) // Max 3 niches
    );
  };

  const handleSubmit = async () => {
    const finalStep = accountType === "CREATOR" ? 5 : 4;
    if (!validateStep(finalStep)) return;
    
    setLoading(true);
    try {
      // Here you would call your registration API
      const payload = {
        ...formData,
        role: accountType,
        creatorType: accountType === "CREATOR" ? selectedType : undefined,
        agencyType: accountType === "AGENCY" ? selectedType : undefined,
        niches: accountType === "CREATOR" ? selectedNiches : undefined,
        audienceSize: accountType === "CREATOR" ? audienceSize : undefined,
      };
      
      console.log("Registration payload:", payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to sign-in or onboarding
      router.push(`/auth/sign-in?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Progress & Info */}
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
                <span className="text-sm font-medium text-purple-300">Step {step} of {totalSteps}</span>
                <div className="flex-1 bg-white/10 rounded-full h-2 ml-4">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
              
              {step === 1 && (
                <div>
                  <h2 className="text-3xl font-bold mb-4">Welcome to the future of creator partnerships</h2>
                  <p className="text-lg text-purple-200">Join thousands of creators and agencies building their brands with AI-powered tools.</p>
                </div>
              )}
              
              {step === 2 && (
                <div>
                  <h2 className="text-3xl font-bold mb-4">Tell us about yourself</h2>
                  <p className="text-lg text-purple-200">We'll customize your experience based on your creator type and goals.</p>
                </div>
              )}
              
              {step === 3 && accountType === "CREATOR" && (
                <div>
                  <h2 className="text-3xl font-bold mb-4">What's your niche?</h2>
                  <p className="text-lg text-purple-200">Choose up to 3 areas that best describe your content focus.</p>
                </div>
              )}
              
              {((step === 4 && accountType === "CREATOR") || (step === 4 && accountType === "AGENCY")) && (
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    {accountType === "CREATOR" ? "Your audience size?" : "Create your account"}
                  </h2>
                  <p className="text-lg text-purple-200">
                    {accountType === "CREATOR" 
                      ? "This helps us suggest appropriate rate cards and partnerships."
                      : "Just a few details to get your agency set up."
                    }
                  </p>
                </div>
              )}
              
              {step === 5 && (
                <div>
                  <h2 className="text-3xl font-bold mb-4">Create your account</h2>
                  <p className="text-lg text-purple-200">You're almost ready to start building your creator brand.</p>
                </div>
              )}
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span>Professional media kit in minutes</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span>AI-powered brand collaboration tools</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span>Streamlined campaign management</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span>Professional invoicing & payments</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              
              {/* Step 1: Account Type */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Choose your path</h3>
                    <p className="text-purple-200">What describes you best?</p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setAccountType("CREATOR")}
                      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                        accountType === "CREATOR"
                          ? "border-purple-400 bg-purple-500/20" 
                          : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Star className="w-6 h-6 text-yellow-400" />
                            <span className="text-lg font-semibold text-white">I'm a Creator</span>
                          </div>
                          <p className="text-sm text-purple-200">Content creator, influencer, or personal brand</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${accountType === "CREATOR" ? "rotate-90 text-purple-400" : "text-white/40"}`} />
                      </div>
                    </button>

                    <button
                      onClick={() => setAccountType("AGENCY")}
                      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                        accountType === "AGENCY"
                          ? "border-purple-400 bg-purple-500/20" 
                          : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="w-6 h-6 text-blue-400" />
                            <span className="text-lg font-semibold text-white">I'm an Agency</span>
                          </div>
                          <p className="text-sm text-purple-200">Agency managing creators or brand campaigns</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${accountType === "AGENCY" ? "rotate-90 text-purple-400" : "text-white/40"}`} />
                      </div>
                    </button>
                  </div>

                  {errors.accountType && (
                    <p className="text-red-400 text-sm">{errors.accountType}</p>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={!accountType}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Creator/Agency Type */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {accountType === "CREATOR" ? "What type of creator are you?" : "What type of agency are you?"}
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {(accountType === "CREATOR" ? CREATOR_TYPES : AGENCY_TYPES).map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            isSelected
                              ? "border-purple-400 bg-purple-500/20" 
                              : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-white">{type.label}</div>
                              <div className="text-sm text-purple-200">{type.desc}</div>
                              {type.audience && (
                                <div className="text-xs text-purple-300 mt-1">{type.audience}</div>
                              )}
                              {(type as any).size && (
                                <div className="text-xs text-purple-300 mt-1">{(type as any).size}</div>
                              )}
                            </div>
                            {isSelected && <Check className="w-5 h-5 text-purple-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {errors.selectedType && (
                    <p className="text-red-400 text-sm">{errors.selectedType}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!selectedType}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Niches (Creator only) */}
              {step === 3 && accountType === "CREATOR" && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Your content niches</h3>
                    <p className="text-purple-200 text-sm">Select up to 3 areas ({selectedNiches.length}/3)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {NICHES.map((niche) => {
                      const Icon = niche.icon;
                      const isSelected = selectedNiches.includes(niche.id);
                      const isDisabled = !isSelected && selectedNiches.length >= 3;
                      
                      return (
                        <button
                          key={niche.id}
                          onClick={() => handleNicheToggle(niche.id)}
                          disabled={isDisabled}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                            isSelected
                              ? "border-purple-400 bg-purple-500/20" 
                              : isDisabled
                              ? "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
                              : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Icon className="w-6 h-6 text-white" />
                            <div className="text-sm font-medium text-white">{niche.label}</div>
                            {isSelected && (
                              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {errors.niches && (
                    <p className="text-red-400 text-sm">{errors.niches}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={selectedNiches.length === 0}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Audience Size (Creator) or Account Details (Agency) */}
              {step === 4 && (
                <div className="space-y-6">
                  {accountType === "CREATOR" ? (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">Your audience size</h3>
                        <p className="text-purple-200 text-sm">This helps us suggest appropriate partnerships</p>
                      </div>

                      <div className="space-y-3">
                        {AUDIENCE_SIZES.map((size) => {
                          const isSelected = audienceSize === size.id;
                          
                          return (
                            <button
                              key={size.id}
                              onClick={() => setAudienceSize(size.id)}
                              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                                isSelected
                                  ? "border-purple-400 bg-purple-500/20" 
                                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-white">{size.label}</div>
                                  <div className="text-sm text-purple-200">{size.desc}</div>
                                </div>
                                {isSelected && <Check className="w-5 h-5 text-purple-400" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {errors.audienceSize && (
                        <p className="text-red-400 text-sm">{errors.audienceSize}</p>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={handleBack}
                          className="flex-1 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!audienceSize}
                          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
                        >
                          Continue
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Agency Account Details */
                    <>
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">Create your account</h3>
                        <p className="text-purple-200 text-sm">Set up your agency workspace</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Full name</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                          />
                          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Email address</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                          />
                          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Create a password"
                              className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Confirm password</label>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm your password"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                          />
                          {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleBack}
                          className="flex-1 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
                        >
                          {loading ? "Creating..." : "Create Account"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 5: Creator Account Details */}
              {step === 5 && accountType === "CREATOR" && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Create your account</h3>
                    <p className="text-purple-200 text-sm">You're almost ready to start building your creator brand</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Full name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      />
                      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Email address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Create a password"
                          className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Confirm password</label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      />
                      {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
                    >
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                  </div>
                </div>
              )}

              {/* Already have account link */}
              <div className="text-center mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-purple-200">
                  Already have an account?{" "}
                  <Link href="/auth/sign-in" className="text-white font-medium hover:text-purple-300 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}