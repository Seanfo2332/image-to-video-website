"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ImageIcon,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle,
  Download,
  FileText,
  History,
  ExternalLink,
} from "lucide-react";

export default function ImageGeneratorPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setErrorMessage("Please upload an image");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    setResultImage(null);
    setSubmissionId(null);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", prompt);

      const response = await fetch("/api/image-generator", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setSubmissionId(data.submissionId || null);
        if (data.resultUrl) {
          setResultImage(data.resultUrl);
        }
        // Keep the preview so user can see what they submitted
        // Only clear the file input
        setImage(null);
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to submit request");
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
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-purple-400" />
          AI Image Generator
        </h1>
        <p className="text-neutral-400">
          Transform your images with AI-powered editing using custom prompts
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
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <label className="block text-white font-medium mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            Upload Image <span className="text-red-400">*</span>
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
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-auto object-contain rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-neutral-500 mb-2" />
                  <p className="text-neutral-400">Click to upload image</p>
                  <p className="text-neutral-500 text-sm">JPEG, PNG</p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <label className="block text-white font-medium mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Custom Prompt (Optional)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe how you want to transform the image... (e.g., 'Make it look like a watercolor painting')"
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Success Message */}
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-green-500/10 border border-green-500/20"
          >
            <div className="flex items-center gap-2 text-green-400 mb-3">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold text-lg">Request Submitted Successfully!</span>
            </div>
            <p className="text-neutral-300 mb-4">
              Your image is being processed by AI. This may take 30-60 seconds.
              {submissionId && (
                <span className="block text-neutral-500 text-sm mt-1">
                  Submission ID: {submissionId}
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <Link
                href="/dashboard/history"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
              >
                <History className="w-4 h-4" />
                Track Progress in History
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitStatus("idle");
                  setImagePreview(null);
                  setPrompt("");
                  setSubmissionId(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate Another
              </button>
            </div>
          </motion.div>
        )}

        {/* Result Image */}
        {resultImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Generated Image
            </h3>
            <img
              src={resultImage}
              alt="Generated"
              className="w-full rounded-xl"
            />
            <a
              href={resultImage}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Image
            </a>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Image
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20"
      >
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          How it works
        </h3>
        <ul className="text-neutral-400 text-sm space-y-2">
          <li>1. Upload an image (JPEG or PNG)</li>
          <li>2. Enter a custom prompt describing the transformation</li>
          <li>3. AI processes and transforms your image</li>
          <li>4. Download your generated image when complete</li>
        </ul>
      </motion.div>
    </div>
  );
}
