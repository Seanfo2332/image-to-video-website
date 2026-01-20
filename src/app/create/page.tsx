"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import {
  Link2,
  ImageIcon,
  FileVideo,
  Mic,
  Languages,
  FileType,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wand2,
  Lock,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// Form options matching n8n form
const imageOptions = [
  { value: "YouTube 标准口播", label: "YouTube 标准口播" },
  { value: "YouTube 标准口播西装", label: "YouTube 标准口播西装" },
  { value: "足球直播", label: "足球直播" },
];

const scriptStyles = [
  { value: "企业深度解析", label: "企业深度解析" },
  { value: "自定义脚本", label: "自定义脚本" },
  { value: "企业深度解析-素材", label: "企业深度解析-素材" },
  { value: "足球", label: "足球" },
];

const languages = [
  { value: "中文", label: "中文" },
  { value: "英语", label: "英语" },
];

const voiceIds = [
  { value: "moss_audio_affebf31-a4f0-11f0-87ae-d2bc00c8f7d2", label: "Voice 1 - affebf31" },
  { value: "moss_audio_aa3c6e63-9c23-11f0-ac24-56b1c4839062", label: "Voice 2 - aa3c6e63" },
  { value: "moss_audio_dbb57018-bb78-11f0-ac4c-6ec75523ad7f", label: "Voice 3 - dbb57018" },
  { value: "moss_audio_583ed315-c222-11f0-bb54-eebc22378c55", label: "Voice 4 - 583ed315" },
  { value: "moss_audio_a4aeabac-c44b-11f0-8e99-26a6b19c3810", label: "Voice 5 - a4aeabac" },
];

const fileFormats = [
  { value: "application/pdf", label: "PDF Document" },
  { value: "video/mp4", label: "MP4 Video" },
];

export default function CreatePage() {
  const { data: session, status } = useSession();

  // Form state - matching n8n field names
  const [formData, setFormData] = useState({
    "field-0": "", // 素材网址
    "field-2": "", // 生成图片选项
    "field-3": "", // 脚本风格
    "field-4": "", // 语言
    "field-5": "", // 声音身份 ID
    "field-6": "", // 文件格式
    "field-7": "", // 视频素材
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...newFiles]);
      if (errors["field-1"]) {
        setErrors((prev) => ({ ...prev, "field-1": "" }));
      }
    }
  };

  const removeFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData["field-0"].trim()) {
      newErrors["field-0"] = "素材网址 is required";
    }
    if (imageFiles.length === 0) {
      newErrors["field-1"] = "Please upload at least one image";
    }
    if (!formData["field-2"]) {
      newErrors["field-2"] = "Please select an image option";
    }
    if (!formData["field-3"]) {
      newErrors["field-3"] = "Please select a script style";
    }
    if (!formData["field-5"]) {
      newErrors["field-5"] = "Please select a voice ID";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      // Create FormData matching n8n form field names
      const submitData = new FormData();
      submitData.append("field-0", formData["field-0"]);
      imageFiles.forEach((file) => {
        submitData.append("field-1", file);
      });
      submitData.append("field-2", formData["field-2"]);
      submitData.append("field-3", formData["field-3"]);
      if (formData["field-4"]) {
        submitData.append("field-4", formData["field-4"]);
      }
      submitData.append("field-5", formData["field-5"]);
      if (formData["field-6"]) {
        submitData.append("field-6", formData["field-6"]);
      }
      if (formData["field-7"]) {
        submitData.append("field-7", formData["field-7"]);
      }

      // Submit to n8n webhook
      const webhookUrl = "https://n8n.srv1007594.hstgr.cloud/webhook/ad77bb16-47ef-46ce-a7dd-e479259f81b8";

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          "field-0": "",
          "field-2": "",
          "field-3": "",
          "field-4": "",
          "field-5": "",
          "field-6": "",
          "field-7": "",
        });
        setImageFiles([]);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] bg-gradient-mesh flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Login required
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] bg-gradient-mesh">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="liquid-glass rounded-2xl p-8 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Login Required</h1>
            <p className="text-neutral-400 mb-6">
              Please sign in to access the Prompt Generator.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/25"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium border border-white/10"
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-gradient-mesh">
      <Navbar />

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob-morph" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-blob-morph" style={{ animationDelay: "-4s" }} />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30"
          >
            <Wand2 className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            提示词一键生成
          </h1>
          <p className="text-neutral-400 text-lg">
            提示词生成武器 - AI Prompt Generator
          </p>
        </motion.div>

        {/* Success State */}
        <AnimatePresence mode="wait">
          {submitStatus === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="liquid-glass rounded-2xl p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-3">
                提交成功！
              </h2>
              <p className="text-neutral-400 mb-8">
                Your prompt has been submitted successfully. You will be notified when it&apos;s ready.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSubmitStatus(null)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/25"
              >
                Create Another
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="liquid-glass rounded-2xl p-8"
            >
              {/* Error Banner */}
              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </motion.div>
              )}

              <div className="space-y-6">
                {/* 素材网址 - Material URL */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                    <Link2 className="w-4 h-4 text-purple-400" />
                    素材网址 <span className="text-pink-400">*</span>
                  </label>
                  <textarea
                    name="field-0"
                    value={formData["field-0"]}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                      errors["field-0"] ? "border-red-500/50" : "border-white/10"
                    } text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none`}
                    placeholder="Enter material URL..."
                  />
                  {errors["field-0"] && (
                    <p className="text-red-400 text-sm mt-1">{errors["field-0"]}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    Image <span className="text-pink-400">*</span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      errors["field-1"]
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".jpeg,.png,.jpg"
                      onChange={handleFileChange}
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-neutral-400">
                      Click or drag to upload images
                    </p>
                    <p className="text-neutral-500 text-sm mt-1">
                      Supports: JPEG, PNG, JPG (Multiple files allowed)
                    </p>
                  </div>
                  {errors["field-1"] && (
                    <p className="text-red-400 text-sm mt-1">{errors["field-1"]}</p>
                  )}

                  {/* File List */}
                  {imageFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {imageFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20"
                        >
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-white truncate max-w-[200px]">
                              {file.name}
                            </span>
                            <span className="text-xs text-neutral-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 生成图片选项 - Image Option */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      生成图片选项 <span className="text-pink-400">*</span>
                    </label>
                    <select
                      name="field-2"
                      value={formData["field-2"]}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                        errors["field-2"] ? "border-red-500/50" : "border-white/10"
                      } text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="" disabled className="bg-neutral-900">
                        Select an option...
                      </option>
                      {imageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-neutral-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors["field-2"] && (
                      <p className="text-red-400 text-sm mt-1">{errors["field-2"]}</p>
                    )}
                  </div>

                  {/* 脚本风格 - Script Style */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <FileType className="w-4 h-4 text-purple-400" />
                      脚本风格 <span className="text-pink-400">*</span>
                    </label>
                    <select
                      name="field-3"
                      value={formData["field-3"]}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                        errors["field-3"] ? "border-red-500/50" : "border-white/10"
                      } text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="" disabled className="bg-neutral-900">
                        Select an option...
                      </option>
                      {scriptStyles.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-neutral-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors["field-3"] && (
                      <p className="text-red-400 text-sm mt-1">{errors["field-3"]}</p>
                    )}
                  </div>

                  {/* 语言 - Language */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <Languages className="w-4 h-4 text-purple-400" />
                      语言
                    </label>
                    <select
                      name="field-4"
                      value={formData["field-4"]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-neutral-900">
                        Select an option...
                      </option>
                      {languages.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-neutral-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 声音身份 ID - Voice ID */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <Mic className="w-4 h-4 text-purple-400" />
                      声音身份 ID <span className="text-pink-400">*</span>
                    </label>
                    <select
                      name="field-5"
                      value={formData["field-5"]}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                        errors["field-5"] ? "border-red-500/50" : "border-white/10"
                      } text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="" disabled className="bg-neutral-900">
                        Select an option...
                      </option>
                      {voiceIds.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-neutral-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors["field-5"] && (
                      <p className="text-red-400 text-sm mt-1">{errors["field-5"]}</p>
                    )}
                  </div>

                  {/* 文件格式 - File Format */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <FileVideo className="w-4 h-4 text-purple-400" />
                      文件格式
                    </label>
                    <select
                      name="field-6"
                      value={formData["field-6"]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-neutral-900">
                        Select an option...
                      </option>
                      {fileFormats.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-neutral-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 视频素材 - Video Material */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <FileVideo className="w-4 h-4 text-purple-400" />
                      视频素材
                    </label>
                    <input
                      type="text"
                      name="field-7"
                      value={formData["field-7"]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      placeholder="Enter video material URL..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      撰写提示词
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-neutral-500 text-sm mt-6"
        >
          Logged in as {session.user?.email}
        </motion.p>
      </main>
    </div>
  );
}
