"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic2,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle,
  Image as ImageIcon,
  FileText,
  Play,
} from "lucide-react";

interface FormData {
  image: File | null;
  videoContent: string;
}

export default function LipSyncPage() {
  const [formData, setFormData] = useState<FormData>({
    image: null,
    videoContent: "",
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
      setErrorMessage("Please upload a portrait image");
      return;
    }

    if (!formData.videoContent.trim()) {
      setErrorMessage("Please enter the script/video content");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const submitData = new FormData();
      submitData.append("Image", formData.image);
      submitData.append("视频内容", formData.videoContent);

      const response = await fetch("/api/lip-sync-generator", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          image: null,
          videoContent: "",
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
          <Mic2 className="w-8 h-8 text-cyan-500" />
          Lip Sync Video Generator
        </h1>
        <p className="text-slate-500">
          Create AI-powered lip sync videos from your portrait and script
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
            <ImageIcon className="w-5 h-5 text-cyan-500" />
            Portrait Image <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={handleImageChange}
              className="hidden"
              id="lip-sync-image-upload"
            />
            <label
              htmlFor="lip-sync-image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#0ABAB5] hover:bg-[#D1F5F3]/20 transition-colors"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-auto object-contain rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-slate-400 mb-3" />
                  <p className="text-slate-500 text-lg">Click to upload portrait</p>
                  <p className="text-slate-400 text-sm mt-1">JPEG, PNG (face clearly visible)</p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Video Content / Script */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <label className="block text-[#1E293B] font-medium mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-500" />
            Script / Video Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.videoContent}
            onChange={(e) => setFormData({ ...formData, videoContent: e.target.value })}
            placeholder="Enter your script or video content here. The AI will generate audio and lip sync the portrait to match..."
            rows={8}
            className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all resize-none text-base leading-relaxed"
          />
          <p className="text-slate-500 text-sm mt-2">
            Character count: {formData.videoContent.length}
          </p>
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
            Lip sync video generation started! Check the History page for progress.
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
              Processing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Generate Lip Sync Video
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-6 rounded-2xl bg-cyan-50 border border-cyan-200"
      >
        <h3 className="text-[#1E293B] font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-500" />
          How Lip Sync Works
        </h3>
        <ul className="text-slate-600 text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 font-bold">1.</span>
            Upload a clear portrait image with a visible face
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 font-bold">2.</span>
            Enter your script - the AI will convert it to speech
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 font-bold">3.</span>
            AI generates natural-sounding audio using Minimax TTS
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 font-bold">4.</span>
            The portrait is animated to lip sync with the audio
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 font-bold">5.</span>
            Download your finished video from the Videos page
          </li>
        </ul>
      </motion.div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
      >
        <h3 className="text-[#1E293B] font-semibold mb-3">Tips for Best Results</h3>
        <ul className="text-slate-600 text-sm space-y-2">
          <li>- Use a high-quality portrait with good lighting</li>
          <li>- Face should be clearly visible and front-facing</li>
          <li>- Keep scripts natural and conversational</li>
          <li>- Longer scripts will produce longer videos</li>
        </ul>
      </motion.div>
    </div>
  );
}
