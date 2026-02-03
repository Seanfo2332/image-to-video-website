"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  Building2,
  ChevronDown,
  History,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  { value: "F&B", label: "Food & Beverage", icon: "🍽️" },
  { value: "Crypto", label: "Crypto & Web3", icon: "₿" },
  { value: "Beauty", label: "Beauty & Wellness", icon: "💄" },
  { value: "Property", label: "Property & Real Estate", icon: "🏠" },
  { value: "Finance", label: "Finance & Investment", icon: "💰" },
  { value: "Other/News", label: "Other / News", icon: "📰" },
];

const LANGUAGES = [
  { value: "English", label: "English", flag: "🇺🇸" },
  { value: "Chinese", label: "Chinese (中文)", flag: "🇨🇳" },
];

export default function GeoContentPage() {
  const [language, setLanguage] = useState("English");
  const [category, setCategory] = useState("");
  const [businessTitle, setBusinessTitle] = useState("");
  const [businessContent, setBusinessContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [contentImages, setContentImages] = useState<File[]>([]);
  const [contentPreviews, setContentPreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleContentImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setContentImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setContentPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const removeContentImage = (index: number) => {
    setContentImages((prev) => prev.filter((_, i) => i !== index));
    setContentPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !businessTitle || !businessContent) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("language", language);
      formData.append("category", category);
      formData.append("businessTitle", businessTitle);
      formData.append("businessContent", businessContent);

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      contentImages.forEach((file, index) => {
        formData.append(`contentImage_${index}`, file);
      });

      const response = await fetch("/api/geo-content/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setCategory("");
        setBusinessTitle("");
        setBusinessContent("");
        setCoverImage(null);
        setCoverPreview(null);
        setContentImages([]);
        setContentPreviews([]);

        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to submit");
      }
    } catch (err) {
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = CATEGORIES.find((c) => c.value === category);
  const selectedLanguage = LANGUAGES.find((l) => l.value === language);

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-[#0ABAB5] flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1E293B]">GEO Content</h1>
              <p className="text-slate-500">Submit your business to multiple websites</p>
            </div>
          </div>
          <Link
            href="/dashboard/geo-content/submissions"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0ABAB5] hover:border-[#0ABAB5]/30 transition-colors"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">My Submissions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-600 font-medium">Content submitted successfully!</span>
            </div>
            <p className="text-sm text-emerald-600/70 ml-8">
              Your content is being processed.
              <Link href="/dashboard/geo-content/submissions" className="underline hover:text-emerald-700 ml-1">
                View your submissions
              </Link>
              {" "}to track progress and see published links.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-600">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language & Category Row */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Language Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#1E293B] mb-2">
              Language
            </label>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-200 text-[#1E293B] hover:border-[#0ABAB5]/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{selectedLanguage?.flag}</span>
                <span>{selectedLanguage?.label}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-white border border-slate-200 shadow-xl z-20"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.value);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                        language === lang.value ? "bg-[#D1F5F3]" : ""
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-[#1E293B]">{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#1E293B] mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-200 text-[#1E293B] hover:border-[#0ABAB5]/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {selectedCategory ? (
                  <>
                    <span className="text-xl">{selectedCategory.icon}</span>
                    <span>{selectedCategory.label}</span>
                  </>
                ) : (
                  <span className="text-slate-400">Select a category</span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCatOpen ? "rotate-180" : ""}`} />
            </button>

            {isCatOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCatOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-white border border-slate-200 shadow-xl z-20 max-h-64 overflow-y-auto"
                >
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        setCategory(cat.value);
                        setIsCatOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                        category === cat.value ? "bg-[#D1F5F3]" : ""
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-[#1E293B]">{cat.label}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Business Title */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-2">
            <Building2 className="w-4 h-4 inline mr-2" />
            Business Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessTitle}
            onChange={(e) => setBusinessTitle(e.target.value)}
            placeholder="Enter your business or article title"
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-colors"
          />
        </div>

        {/* Business Content */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Business Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={businessContent}
            onChange={(e) => setBusinessContent(e.target.value)}
            placeholder="Describe your business, products, services, or write your article content..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-colors resize-none"
          />
          <p className="text-xs text-slate-500 mt-2">
            {businessContent.length} characters
          </p>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-2">
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Cover Image
          </label>

          {coverPreview ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeCoverImage}
                className="absolute top-2 right-2 p-2 rounded-lg bg-slate-900/50 text-white hover:bg-slate-900/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0ABAB5] bg-slate-50 hover:bg-[#D1F5F3]/20 transition-all flex flex-col items-center justify-center gap-3"
            >
              <Upload className="w-8 h-8 text-slate-400" />
              <div className="text-center">
                <p className="text-slate-600 font-medium">Click to upload cover image</p>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP (Max 10MB)</p>
              </div>
            </button>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </div>

        {/* Content Images */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-2">
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Content Images (Optional)
          </label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {contentPreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={preview}
                  alt={`Content ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeContentImage(index)}
                  className="absolute top-1 right-1 p-1.5 rounded-lg bg-slate-900/50 text-white hover:bg-slate-900/70 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => contentInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0ABAB5] bg-slate-50 hover:bg-[#D1F5F3]/20 transition-all flex flex-col items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-xs text-slate-500">Add more</span>
            </button>
          </div>
          <input
            ref={contentInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleContentImagesChange}
            className="hidden"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#0ABAB5]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Globe className="w-5 h-5" />
              Submit to Websites
            </>
          )}
        </motion.button>

        <p className="text-center text-xs text-slate-500">
          Your content will be submitted to multiple websites for maximum exposure
        </p>
      </form>
    </div>
  );
}
