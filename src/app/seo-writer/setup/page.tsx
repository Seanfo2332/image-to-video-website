"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

interface BrandAnalysis {
  brandName: string;
  brandDescription: string;
  tone: string;
  targetAudience: string;
  contentStyle: string;
  brandVoice: string;
  keyThemes: string[];
}

interface Keyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  trafficBoost: number;
}

const IMAGE_STYLES = [
  { id: "clean-minimal", name: "Clean & Minimal", desc: "Flat, professional illustrations" },
  { id: "photorealistic", name: "Photorealistic", desc: "Stock photo style imagery" },
  { id: "watercolor", name: "Watercolor", desc: "Artistic painting aesthetic" },
  { id: "3d-render", name: "3D Render", desc: "Modern 3D illustrations" },
  { id: "vintage", name: "Vintage", desc: "Classic retro style" },
  { id: "abstract", name: "Abstract", desc: "Bold shapes and gradients" },
];

export default function SEOWriterSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Website URL
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Step 2: Brand Analysis
  const [brandAnalysis, setBrandAnalysis] = useState<BrandAnalysis | null>(null);
  const [imageStyle, setImageStyle] = useState("photorealistic");
  const [language, setLanguage] = useState("English");

  // Step 3: Keywords
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  // Site ID after creation
  const [siteId, setSiteId] = useState<string | null>(null);

  // WordPress credentials
  const [wpUsername, setWpUsername] = useState("");
  const [wpPassword, setWpPassword] = useState("");

  const analyzeWebsite = async () => {
    if (!websiteUrl) {
      setError("Please enter a website URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, create the site record
      const siteResponse = await fetch("/api/seo-writer/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`).hostname,
          url: websiteUrl,
          username: "pending",
          appPassword: "pending",
        }),
      });

      if (!siteResponse.ok) {
        const siteError = await siteResponse.json();
        throw new Error(siteError.error || "Failed to create site");
      }

      const site = await siteResponse.json();
      setSiteId(site.id);

      // Then analyze the website
      const response = await fetch("/api/seo-writer/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: site.id, url: websiteUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze website");
      }

      const data = await response.json();
      setBrandAnalysis(data.analysis || data.brandProfile);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const saveBrandProfile = async () => {
    if (!siteId || !brandAnalysis) return;

    setIsLoading(true);
    setError(null);

    try {
      // Update brand profile with selected options
      await fetch("/api/seo-writer/brand-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          ...brandAnalysis,
          imageStyle,
          language,
        }),
      });

      // Discover keywords
      const keywordsResponse = await fetch("/api/seo-writer/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });

      if (keywordsResponse.ok) {
        const keywordsData = await keywordsResponse.json();
        setKeywords(keywordsData.keywords || []);
      }

      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const generateFirstArticle = async () => {
    if (!siteId || keywords.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // Generate article for the top keyword
      await fetch("/api/seo-writer/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          keywordId: keywords[0].keyword, // This should be the keyword ID, but for now we'll use the first one
        }),
      });

      setStep(4);
    } catch (err) {
      // Don't block on article generation error
      console.error("Article generation error:", err);
      setStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  const finishSetup = () => {
    router.push(`/seo-writer?siteId=${siteId}`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                s === step
                  ? "bg-green-500 text-white"
                  : s < step
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/10 text-neutral-500"
              }`}
            >
              {s < step ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`w-16 h-0.5 mx-2 transition-all ${
                  s < step ? "bg-green-500" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Enter Website URL */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-4">
              What's your website?
            </h1>
            <p className="text-neutral-400 mb-8">
              Enter your website URL and we'll analyze it to understand your business.
            </p>

            <div className="max-w-md mx-auto">
              <div className="relative mb-6">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="yourwebsite.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <motion.button
                onClick={analyzeWebsite}
                disabled={isLoading || !websiteUrl}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing your website...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Continue
                  </>
                )}
              </motion.button>

              <p className="text-sm text-neutral-500 mt-4">
                Don't have a website?{" "}
                <button className="text-green-400 hover:underline">
                  Skip this step
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 2: Brand Review */}
        {step === 2 && brandAnalysis && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4 text-center">
              Brand Review
            </h1>
            <p className="text-neutral-400 mb-8 text-center">
              Review and adjust your brand settings if needed.
            </p>

            {/* Brand Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{brandAnalysis.brandName}</h3>
                  <p className="text-sm text-neutral-500">{websiteUrl}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-neutral-400 mb-1">Brand Description</h4>
                  <p className="text-white">{brandAnalysis.brandDescription}</p>
                </div>
                <div>
                  <h4 className="text-neutral-400 mb-1">Tone</h4>
                  <p className="text-white">{brandAnalysis.tone}</p>
                </div>
                <div>
                  <h4 className="text-neutral-400 mb-1">Target Audience</h4>
                  <p className="text-white">{brandAnalysis.targetAudience}</p>
                </div>
                <div>
                  <h4 className="text-neutral-400 mb-1">Brand Voice</h4>
                  <p className="text-white">{brandAnalysis.brandVoice}</p>
                </div>
                <div>
                  <h4 className="text-neutral-400 mb-2">Key Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {brandAnalysis.keyThemes?.map((theme, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Malay">Malay</option>
              </select>
            </div>

            {/* Image Style Selection */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-4">
                Choose article image style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {IMAGE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setImageStyle(style.id)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      imageStyle === style.id
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                      <ImageIcon className="w-5 h-5 text-neutral-400" />
                    </div>
                    <h4 className="text-white font-medium text-sm">{style.name}</h4>
                    <p className="text-neutral-500 text-xs">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <motion.button
                onClick={saveBrandProfile}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Discovering keywords...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Keywords Preview */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4 text-center">
              Upcoming Articles
            </h1>
            <p className="text-neutral-400 mb-8 text-center">
              Some examples of what SEO Writer will create for you.
            </p>

            <div className="space-y-3 mb-8">
              {keywords.slice(0, 5).map((kw, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <h4 className="text-white font-medium">{kw.keyword}</h4>
                  <p className="text-sm text-neutral-500">
                    Est. monthly traffic boost: +{kw.trafficBoost}
                  </p>
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <motion.button
                onClick={() => setStep(4)}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 4: All Set */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">All set!</h1>
            <p className="text-neutral-400 mb-8">
              SEO Writer is ready to generate content for your site.
            </p>

            {/* WordPress Connection */}
            <div className="max-w-md mx-auto mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-400" />
                Connect WordPress (Optional)
              </h3>
              <p className="text-neutral-400 text-sm mb-4">
                Connect your WordPress site to auto-publish articles.
              </p>
              <input
                type="text"
                value={wpUsername}
                onChange={(e) => setWpUsername(e.target.value)}
                placeholder="WordPress Username"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 mb-3"
              />
              <input
                type="password"
                value={wpPassword}
                onChange={(e) => setWpPassword(e.target.value)}
                placeholder="Application Password"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 mb-3"
              />
              <p className="text-xs text-neutral-500">
                Find in WordPress Admin → Users → Profile → Application Passwords
              </p>
            </div>

            <motion.button
              onClick={finishSetup}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 mx-auto"
            >
              <FileText className="w-5 h-5" />
              Go to Dashboard
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
