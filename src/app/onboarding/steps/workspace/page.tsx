"use client";

import { useState } from "react";
import { Sparkles, Users, Briefcase, Star, Building, ArrowRight, Globe, Zap, Camera } from "lucide-react";
import { createWorkspace } from "./actions";

const WORKSPACE_TYPES = [
  {
    id: "CREATOR_TEAM",
    label: "Creator Workspace",
    desc: "Personal brand and content creation",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    features: ["AI-powered media kit", "Brand partnership tools", "Content planning", "Revenue tracking"]
  },
  {
    id: "AGENCY",
    label: "Agency Workspace", 
    desc: "Manage multiple creators and campaigns",
    icon: Building,
    color: "from-blue-500 to-indigo-500",
    features: ["Creator roster management", "Campaign coordination", "Client reporting", "Team collaboration"]
  }
];

const WORKSPACE_SIZES = [
  { id: "solo", label: "Just me", desc: "Individual creator", icon: Users },
  { id: "small", label: "Small team (2-5)", desc: "Growing creator team", icon: Users },
  { id: "medium", label: "Medium team (6-20)", desc: "Established agency", icon: Building },
  { id: "large", label: "Enterprise (20+)", desc: "Large-scale operations", icon: Globe }
];

export default function WorkspaceStep() {
  const [formData, setFormData] = useState({
    name: "",
    type: "" as "CREATOR_TEAM" | "AGENCY" | ""
  });
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Workspace name is required";
    if (!formData.type) newErrors.type = "Please select a workspace type";
    if (!selectedSize) newErrors.size = "Please select your team size";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("type", formData.type);
      
      await createWorkspace(formDataToSend);
    } catch (error) {
      setErrors({ submit: "Failed to create workspace. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const selectedWorkspace = WORKSPACE_TYPES.find(w => w.id === formData.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Info */}
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
                <span className="text-sm font-medium text-purple-300">Step 1 of 4</span>
                <div className="flex-1 bg-white/10 rounded-full h-2 ml-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-1/4 transition-all duration-500 ease-out" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Create your workspace</h2>
              <p className="text-lg text-purple-200">
                Your workspace is the central hub for all brand partnerships, content planning, and revenue tracking.
              </p>
            </div>

            {/* Selected Workspace Preview */}
            {selectedWorkspace && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedWorkspace.color} flex items-center justify-center`}>
                    <selectedWorkspace.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{selectedWorkspace.label}</h3>
                    <p className="text-sm text-purple-200">{selectedWorkspace.desc}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {selectedWorkspace.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-purple-200">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-purple-200 text-sm">Active creators</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white mb-1">$2M+</div>
              <div className="text-purple-200 text-sm">Revenue generated</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Set up your workspace</h3>
                <p className="text-purple-200">Choose the workspace that fits your needs</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Workspace Type Selection */}
                <div className="space-y-3">
                  {WORKSPACE_TYPES.map((workspace) => {
                    const Icon = workspace.icon;
                    const isSelected = formData.type === workspace.id;
                    
                    return (
                      <button
                        key={workspace.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: workspace.id as any }))}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          isSelected
                            ? "border-purple-400 bg-purple-500/20" 
                            : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${workspace.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{workspace.label}</div>
                            <div className="text-sm text-purple-200">{workspace.desc}</div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {errors.type && <p className="text-red-400 text-sm">{errors.type}</p>}

                {/* Workspace Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Workspace name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={formData.type === "AGENCY" ? "My Agency" : "My Brand"}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Team Size */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Team size</label>
                  <div className="grid grid-cols-2 gap-3">
                    {WORKSPACE_SIZES.map((size) => {
                      const Icon = size.icon;
                      const isSelected = selectedSize === size.id;
                      
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setSelectedSize(size.id)}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                            isSelected
                              ? "border-purple-400 bg-purple-500/20" 
                              : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                          }`}
                        >
                          <Icon className="w-5 h-5 text-white mx-auto mb-2" />
                          <div className="text-sm font-medium text-white">{size.label}</div>
                          <div className="text-xs text-purple-200">{size.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.size && <p className="text-red-400 text-sm mt-2">{errors.size}</p>}
                </div>

                {errors.submit && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-300 text-sm">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating workspace...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
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