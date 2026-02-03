"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle,
  Image as ImageIcon,
  Mic,
  Languages,
  Clock,
  FileText,
} from "lucide-react";

interface FormData {
  image: File | null;
  imageStyle: string;
  scriptTopic: string;
  voiceId: string;
  language: string;
  duration: string;
  customPrompt: string;
}

const imageStyleOptions = [
  { value: "韩系写真", label: "Korean Style Portrait" },
  { value: "自定义", label: "Custom" },
  { value: "马来", label: "Malaysian Style" },
];

const scriptTopicOptions = [
  { value: "股票投资", label: "Stock Investment" },
  { value: "外汇交易", label: "Forex Trading" },
  { value: "赌博", label: "Gaming/Gambling" },
];

const voiceOptions = [
  { value: "English_Trustworth_Man", label: "English - Trustworthy Man" },
  { value: "moss_audio_f1008f57-ecae-11f0-ae84-1a25b61af6e2", label: "Custom Voice 1" },
];

const languageOptions = [
  { value: "中文", label: "Chinese" },
  { value: "英语", label: "English" },
  { value: "马来语", label: "Malay" },
];

const durationOptions = [
  { value: "15 秒", label: "15 Seconds" },
  { value: "1 分钟", label: "1 Minute" },
  { value: "3 分钟", label: "3 Minutes" },
  { value: "10 分钟", label: "10 Minutes" },
];

export default function VideoGeneratorPage() {
  const [formData, setFormData] = useState<FormData>({
    image: null,
    imageStyle: "",
    scriptTopic: "",
    voiceId: "",
    language: "",
    duration: "",
    customPrompt: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      setErrorMessage("Please upload an image");
      return;
    }

    if (!formData.imageStyle || !formData.scriptTopic || !formData.voiceId || !formData.language || !formData.duration) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const submitData = new FormData();
      submitData.append("Image", formData.image);
      submitData.append("生成图片选项", formData.imageStyle);
      submitData.append("口播主题", formData.scriptTopic);
      submitData.append("声音身份 ID", formData.voiceId);
      submitData.append("语言", formData.language);
      submitData.append("口播 (分钟)", formData.duration);
      submitData.append("自定义图片提示词", formData.customPrompt);

      const response = await fetch("/api/video-generator", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          image: null,
          imageStyle: "",
          scriptTopic: "",
          voiceId: "",
          language: "",
          duration: "",
          customPrompt: "",
        });
        setImagePreview(null);
      } else {
        const data = await response.json();
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to submit");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2 flex items-center gap-3">
          <Video className="w-8 h-8 text-violet-500" />
          AI Video Generator
        </h1>
        <p className="text-slate-500">
          Generate AI-powered talking head videos with custom scripts and voices
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Image Upload */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <label className="block text-[#1E293B] font-medium mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-violet-500" />
            Upload Image <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#0ABAB5] hover:bg-[#D1F5F3]/20 transition-colors"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-auto object-contain rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-slate-500">Click to upload image</p>
                  <p className="text-slate-400 text-sm">JPEG, PNG</p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Style */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <label className="block text-[#1E293B] font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              Image Style <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.imageStyle}
              onChange={(e) => setFormData({ ...formData, imageStyle: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#1E293B] focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all"
            >
              <option value="">Select style...</option>
              {imageStyleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Script Topic */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <label className="block text-[#1E293B] font-medium mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0ABAB5]" />
              Script Topic <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.scriptTopic}
              onChange={(e) => setFormData({ ...formData, scriptTopic: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#1E293B] focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all"
            >
              <option value="">Select topic...</option>
              {scriptTopicOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Voice */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <label className="block text-[#1E293B] font-medium mb-3 flex items-center gap-2">
              <Mic className="w-5 h-5 text-emerald-500" />
              Voice <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.voiceId}
              onChange={(e) => setFormData({ ...formData, voiceId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#1E293B] focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all"
            >
              <option value="">Select voice...</option>
              {voiceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <label className="block text-[#1E293B] font-medium mb-3 flex items-center gap-2">
              <Languages className="w-5 h-5 text-amber-500" />
              Language <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#1E293B] focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all"
            >
              <option value="">Select language...</option>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <label className="block text-[#1E293B] font-medium mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Video Duration <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, duration: option.value })}
                className={`px-4 py-3 rounded-xl border transition-all ${
                  formData.duration === option.value
                    ? "bg-[#D1F5F3] border-[#0ABAB5]/50 text-[#089691]"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <label className="block text-[#1E293B] font-medium mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-500" />
            Custom Image Prompt (Optional)
          </label>
          <textarea
            value={formData.customPrompt}
            onChange={(e) => setFormData({ ...formData, customPrompt: e.target.value })}
            placeholder="Enter custom prompt for image generation..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all resize-none"
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
            {errorMessage}
          </div>
        )}

        {/* Success Message */}
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Video generation started! Check the History page for progress.
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="w-full py-4 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium shadow-lg shadow-[#0ABAB5]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              Generate Video
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-6 rounded-2xl bg-violet-50 border border-violet-200"
      >
        <h3 className="text-[#1E293B] font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          How it works
        </h3>
        <ul className="text-slate-600 text-sm space-y-2">
          <li>1. Upload a portrait image (face clearly visible)</li>
          <li>2. Select image style and script topic</li>
          <li>3. Choose voice and language preferences</li>
          <li>4. AI generates a talking head video with your settings</li>
          <li>5. Download from the Videos page when complete</li>
        </ul>
      </motion.div>
    </div>
  );
}
