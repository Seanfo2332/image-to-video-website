"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  FileText,
  Sparkles,
  Image as ImageIcon,
  Search,
  Zap,
} from "lucide-react";
import { GenerationProgressModal } from "@/components/seo-writer/generation-progress-modal";
import { ScheduledKeywordModal } from "@/components/seo-writer/scheduled-keyword-modal";

interface Article {
  id: string;
  title: string;
  featuredImage: string | null;
  status: string;
  scheduledFor: string | null;
  createdAt: string;
  keyword?: {
    keyword: string;
  };
}

interface Keyword {
  id: string;
  keyword: string;
  trafficBoost: number | null;
  status: string;
}

interface DayContent {
  articles: Article[];
  keyword?: Keyword; // Suggested keyword for this day
}

interface DayData {
  [date: string]: DayContent;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const siteId = searchParams.get("siteId");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayData, setDayData] = useState<DayData>({});
  const [pendingKeywords, setPendingKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatingKeyword, setGeneratingKeyword] = useState("");
  const [generatingDate, setGeneratingDate] = useState<string | null>(null);

  // Modal states
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);

  useEffect(() => {
    if (siteId) {
      fetchData();
    }
  }, [siteId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch articles and keywords in parallel
      const [articlesRes, keywordsRes] = await Promise.all([
        fetch(`/api/seo-writer/articles?siteId=${siteId}`),
        fetch(`/api/seo-writer/keywords?siteId=${siteId}`),
      ]);

      const articles: Article[] = articlesRes.ok ? await articlesRes.json() : [];
      const keywordsData = keywordsRes.ok ? await keywordsRes.json() : { keywords: [] };
      const keywords: Keyword[] = keywordsData.keywords || keywordsData || [];

      // Get pending keywords (not yet used for articles)
      const pending = keywords.filter((k: Keyword) => k.status === "pending");
      setPendingKeywords(pending);

      // Group articles by date
      const grouped: DayData = {};
      articles.forEach((article: Article) => {
        const dateKey = article.scheduledFor
          ? new Date(article.scheduledFor).toISOString().split("T")[0]
          : new Date(article.createdAt).toISOString().split("T")[0];
        if (!grouped[dateKey]) {
          grouped[dateKey] = { articles: [] };
        }
        grouped[dateKey].articles.push(article);
      });

      // Assign pending keywords to empty future days (next 14 days)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let keywordIndex = 0;

      for (let i = 1; i <= 14 && keywordIndex < pending.length; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + i);
        const dateKey = futureDate.toISOString().split("T")[0];

        // Only assign keyword if no articles exist for this day
        if (!grouped[dateKey] || grouped[dateKey].articles.length === 0) {
          if (!grouped[dateKey]) {
            grouped[dateKey] = { articles: [] };
          }
          grouped[dateKey].keyword = pending[keywordIndex];
          keywordIndex++;
        }
      }

      setDayData(grouped);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenKeywordModal = (keyword: Keyword, date: Date) => {
    setSelectedKeyword(keyword);
    setSelectedDate(date);
    setIsKeywordModalOpen(true);
  };

  const handleCloseKeywordModal = () => {
    setIsKeywordModalOpen(false);
    setSelectedKeyword(null);
    setSelectedDate(null);
  };

  const handleRemoveKeywordFromDay = () => {
    if (!selectedDate) return;

    const dateKey = selectedDate.toISOString().split("T")[0];

    // Remove the keyword from that day's data
    setDayData((prev) => {
      const updated = { ...prev };
      if (updated[dateKey]) {
        updated[dateKey] = {
          ...updated[dateKey],
          keyword: undefined,
        };
      }
      return updated;
    });

    handleCloseKeywordModal();
  };

  const handleGenerateFromKeyword = async () => {
    if (!siteId || !selectedKeyword || !selectedDate) return;

    const dateKey = selectedDate.toISOString().split("T")[0];

    handleCloseKeywordModal();
    setIsGenerating(true);
    setGeneratingKeyword(selectedKeyword.keyword);
    setGeneratingDate(dateKey);
    setGenerationStep(1);

    try {
      const progressInterval = setInterval(() => {
        setGenerationStep((prev) => (prev < 5 ? prev + 1 : prev));
      }, 3000);

      // Parse the date and set to 9am
      const scheduledFor = new Date(dateKey);
      scheduledFor.setHours(9, 0, 0, 0);

      const response = await fetch("/api/seo-writer/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          keywordId: selectedKeyword.id,
          articleLength: "medium",
          scheduledFor: scheduledFor.toISOString(),
        }),
      });

      clearInterval(progressInterval);
      setGenerationStep(5);

      if (response.ok) {
        setTimeout(() => {
          setIsGenerating(false);
          setGenerationStep(0);
          setGeneratingDate(null);
          fetchData(); // Refresh the calendar
        }, 1000);
      } else {
        throw new Error("Failed to generate article");
      }
    } catch (error) {
      console.error("Failed to generate article:", error);
      setIsGenerating(false);
      setGenerationStep(0);
      setGeneratingDate(null);
      alert("Failed to generate article. Please try again.");
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;

    const days: (Date | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "draft":
        return "bg-orange-500";
      case "generating":
        return "bg-yellow-500";
      default:
        return "bg-neutral-500";
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const days = getDaysInMonth(currentDate);

  if (!siteId) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-xl text-white mb-2">No site selected</h2>
        <p className="text-neutral-400 mb-6">Please select a site first.</p>
        <Link href="/seo-writer">
          <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400">
            Go to SEO Writer
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Calendar</h1>
          <p className="text-neutral-400">
            {pendingKeywords.length} keywords queued for the next 14 days
          </p>
        </div>
        <Link href={`/seo-writer/keywords?siteId=${siteId}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg bg-white/10 text-white font-medium flex items-center gap-2 hover:bg-white/20 transition-colors"
          >
            <Search className="w-4 h-4" />
            Manage Keywords
          </motion.button>
        </Link>
      </div>

      {/* Info Banner */}
      {pendingKeywords.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-400 font-medium">Auto-scheduled keywords</p>
              <p className="text-sm text-blue-300/70 mt-1">
                Click on any keyword card to generate an article for that day. Articles will be scheduled for 9:00 AM.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-400" />
        </button>
        <h2 className="text-xl font-semibold text-white">
          {formatMonthYear(currentDate)}
        </h2>
        <button
          onClick={() => navigateMonth("next")}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-white/10">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-neutral-400 border-r border-white/10 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[130px] p-2 border-r border-b border-white/5 last:border-r-0 bg-white/[0.02]"
                  />
                );
              }

              const dateKey = date.toISOString().split("T")[0];
              const dayContent = dayData[dateKey] || { articles: [] };
              const isTodayDate = isToday(date);
              const isFuture = isFutureDate(date);
              const isGeneratingThisDay = generatingDate === dateKey;

              return (
                <div
                  key={dateKey}
                  className={`min-h-[130px] p-2 border-r border-b border-white/5 last:border-r-0 transition-colors ${
                    isTodayDate ? "bg-green-500/10" : "hover:bg-white/5"
                  }`}
                >
                  {/* Date Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium ${
                        isTodayDate
                          ? "w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center"
                          : "text-neutral-400"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    {/* Show articles if any */}
                    {dayContent.articles.slice(0, 2).map((article) => (
                      <Link
                        key={article.id}
                        href={`/seo-writer/articles/${article.id}?siteId=${siteId}`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group flex items-center gap-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded overflow-hidden bg-white/10 flex-shrink-0">
                            {article.featuredImage ? (
                              <img
                                src={article.featuredImage}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="w-3 h-3 text-neutral-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">
                              {article.title}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${getStatusColor(
                                  article.status
                                )}`}
                              />
                              <span className="text-[10px] text-neutral-500 capitalize">
                                {article.status}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}

                    {/* Show suggested keyword if no articles and it's a future date */}
                    {dayContent.articles.length === 0 &&
                      dayContent.keyword &&
                      isFuture && (
                        <motion.button
                          onClick={() =>
                            handleOpenKeywordModal(dayContent.keyword!, date)
                          }
                          disabled={isGenerating}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingThisDay ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                              <span className="text-xs text-purple-400">
                                Generating...
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5 mb-1">
                                <Search className="w-3 h-3 text-purple-400" />
                                <span className="text-[10px] text-purple-400 font-medium">
                                  KEYWORD
                                </span>
                              </div>
                              <p className="text-xs text-white truncate">
                                {dayContent.keyword.keyword}
                              </p>
                              {dayContent.keyword.trafficBoost && (
                                <p className="text-[10px] text-green-400 mt-0.5">
                                  +{dayContent.keyword.trafficBoost} traffic
                                </p>
                              )}
                            </>
                          )}
                        </motion.button>
                      )}

                    {dayContent.articles.length > 2 && (
                      <p className="text-[10px] text-neutral-500 text-center">
                        +{dayContent.articles.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-sm text-neutral-400">Pending Keyword</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-neutral-400">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-sm text-neutral-400">Draft</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-neutral-400">Published</span>
        </div>
      </div>

      {/* Scheduled Keyword Modal */}
      <ScheduledKeywordModal
        isOpen={isKeywordModalOpen}
        onClose={handleCloseKeywordModal}
        keyword={selectedKeyword}
        date={selectedDate}
        onGenerate={handleGenerateFromKeyword}
        onRemove={handleRemoveKeywordFromDay}
        isGenerating={isGenerating}
      />

      {/* Generation Progress Modal */}
      <GenerationProgressModal
        isOpen={isGenerating}
        currentStep={generationStep}
        keyword={generatingKeyword}
      />
    </div>
  );
}
