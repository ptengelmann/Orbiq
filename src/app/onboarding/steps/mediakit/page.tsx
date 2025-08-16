"use client";

import { useState } from "react";
import { Sparkles, Globe, User, FileText, Link, ArrowRight, Copy, Check, ExternalLink } from "lucide-react";
import { createMediaKit } from "./actions";

const HANDLE_SUGGESTIONS = [
  "creator", "brand", "studio", "media", "content", "official", "pro", "digital"
];

const BIO_TEMPLATES = [
  "Content creator passionate about [your niche] | Collaborating with brands worldwide",
  "Digital storyteller | [Your specialty] expert | Let's create something amazing together",
  "[Your niche] creator | Building community through authentic content | Open for partnerships",
  "Creative professional | [Your focus area] | Turning ideas into engaging content"
];

export default function MediaKitStep() {
  const [formData, setFormData] = useState({
    handle: "",
    title: "",
    bio: "",
    website: "",
    customBio: ""
  });
  const [selectedBioTemplate, setSelectedBioTemplate] = useState("");
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingHandle, setCheckingHandle] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const checkHandleAvailability = async (handle: string) => {
    if (handle.length < 3) return;
    
    setCheckingHandle(true);
    // Simulate API call - replace with actual check
    await new Promise(resolve => setTimeout(resolve, 500));
    setHandleAvailable(Math.random() > 0.3); // 70% chance available
    setCheckingHandle(false);
  };

  const handleHandleChange = (value: string) => {
    // Clean handle: lowercase, alphanumeric only
    const cleanHandle = value.toLowerCase().replace(/[^a-z0-9]/g, '');
    setFormData(prev => ({ ...prev, handle: cleanHandle }));
    setHandleAvailable(null);
    
    if (cleanHandle.length >= 3) {
      checkHandleAvailability(cleanHandle);
    }
  };

  const generateHandle = () => {
    const baseName = formData.title || "creator";
    const randomSuffix = HANDLE_SUGGESTIONS[Math.floor(Math.random() * HANDLE_SUGGESTIONS.length)];
    const randomNum = Math.floor(Math.random() * 99);
    const suggestion = `${baseName.toLowerCase().replace(/[^a-z0-9]/g, '')}${randomSuffix}${randomNum}`;
    handleHandleChange(suggestion);
  };

  const copyMediaKitUrl = () => {
    const url = `https://orbiq.co/u/${formData.handle}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.handle.trim()) newErrors.handle = "Handle is required";
    if (formData.handle.length < 3) newErrors.handle = "Handle must be at least 3 characters";
    if (!handleAvailable) newErrors.handle = "Handle is not available";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    
    const finalBio = formData.customBio || selectedBioTemplate;
    if (!finalBio.trim()) newErrors.bio = "Bio is required";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("handle", formData.handle);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("bio", finalBio);
      if (formData.website) {
        formDataToSend.append("website", formData.website);
      }
      
      await createMediaKit(formDataToSend);
    } catch (error) {
      setErrors({ submit: "Failed to create media kit. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const mediaKitUrl = `https://orbiq.co/u/${formData.handle}`;

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
                <span className="text-sm font-medium text-purple-300">Step 4 of 4</span>
                <div className="flex-1 bg-white/10 rounded-full h-2 ml-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-full transition-all duration-500 ease-out" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Create your media kit</h2>
              <p className="text-lg text-purple-200">
                Your professional media kit will showcase your brand to potential partners and help you land better collaborations.
              </p>
            </div>

            {/* Media Kit Preview */}
            {formData.handle && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-white">Your Media Kit URL</h3>
                    <p className="text-sm text-purple-200">Share this with brands</p>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-3 mb-3">
                  <p className="text-sm text-purple-300 font-mono">{mediaKitUrl}</p>
                </div>
                
                <button
                  onClick={copyMediaKitUrl}
                  className="flex items-center gap-2 text-sm text-purple-300 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy URL"}
                </button>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span>Professional, shareable media kit</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span>Automatic brand inquiry forms</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span>Analytics and insights</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Publish your media kit</h3>
                <p className="text-purple-200">Make it easy for brands to find and work with you</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Handle */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Choose your handle</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 text-sm">
                      orbiq.co/u/
                    </div>
                    <input
                      type="text"
                      value={formData.handle}
                      onChange={(e) => handleHandleChange(e.target.value)}
                      placeholder="yourname"
                      className="w-full pl-24 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {checkingHandle ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : handleAvailable === true ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : handleAvailable === false ? (
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-white text-xs">✕</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {formData.handle.length >= 3 && handleAvailable === false && (
                    <p className="text-red-400 text-sm mt-1">Handle not available</p>
                  )}
                  {errors.handle && <p className="text-red-400 text-sm mt-1">{errors.handle}</p>}
                  
                  <button
                    type="button"
                    onClick={generateHandle}
                    className="text-sm text-purple-300 hover:text-white transition-colors mt-2"
                  >
                    Generate suggestion
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Professional title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Content Creator & Brand Partner"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Bio Templates */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Bio</label>
                  <div className="space-y-2 mb-3">
                    {BIO_TEMPLATES.map((template, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setSelectedBioTemplate(template);
                          setFormData(prev => ({ ...prev, customBio: "" }));
                        }}
                        className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                          selectedBioTemplate === template
                            ? "border-purple-400 bg-purple-500/20 text-white"
                            : "border-white/20 bg-white/5 text-purple-200 hover:border-white/40"
                        }`}
                      >
                        <p className="text-sm">{template}</p>
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={formData.customBio}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, customBio: e.target.value }));
                        setSelectedBioTemplate("");
                      }}
                      placeholder="Or write your own bio..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                    />
                  </div>
                  {errors.bio && <p className="text-red-400 text-sm mt-1">{errors.bio}</p>}
                </div>

                {/* Website (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Website (optional)</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                </div>

                {errors.submit && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-300 text-sm">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !handleAvailable}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      Publish Media Kit
                      <ExternalLink className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Preview Button */}
              {formData.handle && handleAvailable && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2 mx-auto"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview media kit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}