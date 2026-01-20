"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";

// Custom Select Component
interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
}

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  error,
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.995 }}
        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
          error
            ? "border-red-500/50"
            : isOpen
            ? "border-purple-500/50 ring-1 ring-purple-500/50"
            : "border-white/10 hover:border-white/20"
        } text-left transition-all duration-200 flex items-center justify-between gap-3 group`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && (
            <span className={`flex-shrink-0 transition-colors ${isOpen ? "text-purple-400" : "text-neutral-500 group-hover:text-purple-400"}`}>
              {icon}
            </span>
          )}
          <span className={`truncate ${selectedOption ? "text-white" : "text-neutral-500"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 ${isOpen ? "text-purple-400" : "text-neutral-500"}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 py-2 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center justify-between gap-3 transition-all duration-150 ${
                    value === option.value
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {option.icon && <span className="text-purple-400">{option.icon}</span>}
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Form options matching n8n form
const imageOptions: SelectOption[] = [
  { value: "YouTube 标准口播", label: "YouTube 标准口播" },
  { value: "YouTube 标准口播西装", label: "YouTube 标准口播西装" },
  { value: "足球直播", label: "足球直播" },
];

const scriptStyles: SelectOption[] = [
  { value: "企业深度解析", label: "企业深度解析" },
  { value: "自定义脚本", label: "自定义脚本" },
  { value: "企业深度解析-素材", label: "企业深度解析-素材" },
  { value: "足球", label: "足球" },
];

const languages: SelectOption[] = [
  { value: "中文", label: "中文 (Chinese)" },
  { value: "英语", label: "英语 (English)" },
];

const voiceIds: SelectOption[] = [
  { value: "moss_audio_affebf31-a4f0-11f0-87ae-d2bc00c8f7d2", label: "Voice 1 - Natural Male" },
  { value: "moss_audio_aa3c6e63-9c23-11f0-ac24-56b1c4839062", label: "Voice 2 - Professional" },
  { value: "moss_audio_dbb57018-bb78-11f0-ac4c-6ec75523ad7f", label: "Voice 3 - Energetic" },
  { value: "moss_audio_583ed315-c222-11f0-bb54-eebc22378c55", label: "Voice 4 - Calm" },
  { value: "moss_audio_a4aeabac-c44b-11f0-8e99-26a6b19c3810", label: "Voice 5 - Dynamic" },
];

const fileFormats: SelectOption[] = [
  { value: "application/pdf", label: "PDF Document" },
  { value: "video/mp4", label: "MP4 Video" },
];

export default function CreatePage() {
  const { data: session } = useSession();

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      // Submit via local API proxy to avoid CORS
      const response = await fetch("/api/prompt-generator", {
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob-morph" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-blob-morph" style={{ animationDelay: "-4s" }} />
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.4);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.6);
        }
      `}</style>

      <div className="relative z-10">
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
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
              <p className="text-neutral-400 mb-6">
                Your prompt has been submitted and is being processed.
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
              className="liquid-glass rounded-2xl p-6 md:p-8"
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
                  <motion.div
                    whileHover="hover"
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
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <motion.div
                      className="relative mx-auto mb-3 w-16 h-16"
                      variants={{
                        hover: {
                          scale: 1.1,
                        }
                      }}
                    >
                      {/* Animated rings */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-purple-500/20"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-pink-500/20"
                        animate={{
                          scale: [1, 1.8, 1],
                          opacity: [0.3, 0, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.3,
                        }}
                      />
                      {/* Icon container */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10"
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <motion.div
                          variants={{
                            hover: {
                              rotate: [0, -10, 10, 0],
                              transition: { duration: 0.5 }
                            }
                          }}
                        >
                          <Upload className="w-7 h-7 text-purple-400" />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                    <p className="text-neutral-300 font-medium">
                      Click or drag to upload images
                    </p>
                    <p className="text-neutral-500 text-sm mt-1">
                      Supports: JPEG, PNG, JPG (Multiple files allowed)
                    </p>
                  </motion.div>
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
                    <CustomSelect
                      options={imageOptions}
                      value={formData["field-2"]}
                      onChange={(value) => handleSelectChange("field-2", value)}
                      placeholder="Select image style..."
                      error={errors["field-2"]}
                      icon={<Sparkles className="w-4 h-4" />}
                    />
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
                    <CustomSelect
                      options={scriptStyles}
                      value={formData["field-3"]}
                      onChange={(value) => handleSelectChange("field-3", value)}
                      placeholder="Select script style..."
                      error={errors["field-3"]}
                      icon={<FileType className="w-4 h-4" />}
                    />
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
                    <CustomSelect
                      options={languages}
                      value={formData["field-4"]}
                      onChange={(value) => handleSelectChange("field-4", value)}
                      placeholder="Select language..."
                      icon={<Languages className="w-4 h-4" />}
                    />
                  </div>

                  {/* 声音身份 ID - Voice ID */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <Mic className="w-4 h-4 text-purple-400" />
                      声音身份 ID <span className="text-pink-400">*</span>
                    </label>
                    <CustomSelect
                      options={voiceIds}
                      value={formData["field-5"]}
                      onChange={(value) => handleSelectChange("field-5", value)}
                      placeholder="Select voice..."
                      error={errors["field-5"]}
                      icon={<Mic className="w-4 h-4" />}
                    />
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
                    <CustomSelect
                      options={fileFormats}
                      value={formData["field-6"]}
                      onChange={(value) => handleSelectChange("field-6", value)}
                      placeholder="Select format..."
                      icon={<FileVideo className="w-4 h-4" />}
                    />
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
          Logged in as {session?.user?.email}
        </motion.p>
      </div>
    </div>
  );
}
