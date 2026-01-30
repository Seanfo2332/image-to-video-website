"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Trash2,
  TestTube,
  Save,
  Pencil,
  Globe,
  ChevronDown,
  X,
  AlertTriangle,
  Unplug,
  Zap,
  Clock,
} from "lucide-react";

interface BrandProfile {
  id: string;
  brandName: string;
  brandDescription: string;
  tone: string;
  targetAudience: string;
  contentStyle: string;
  brandVoice: string;
  keyThemes: string[];
  language: string;
  imageStyle: string;
}

interface Site {
  id: string;
  name: string;
  url: string;
  username: string;
  isConnected: boolean;
  lastTestedAt: string | null;
  brandProfile: BrandProfile | null;
}

interface AutoPublishSettings {
  id: string;
  enabled: boolean;
  publishTime: string;
  timezone: string;
  daysAhead: number;
}

const LANGUAGES = [
  { code: "English", flag: "🇺🇸", name: "English" },
  { code: "Spanish", flag: "🇪🇸", name: "Spanish" },
  { code: "French", flag: "🇫🇷", name: "French" },
  { code: "German", flag: "🇩🇪", name: "German" },
  { code: "Chinese", flag: "🇨🇳", name: "Chinese" },
  { code: "Japanese", flag: "🇯🇵", name: "Japanese" },
  { code: "Korean", flag: "🇰🇷", name: "Korean" },
  { code: "Malay", flag: "🇲🇾", name: "Malay" },
  { code: "Indonesian", flag: "🇮🇩", name: "Indonesian" },
  { code: "Thai", flag: "🇹🇭", name: "Thai" },
  { code: "Vietnamese", flag: "🇻🇳", name: "Vietnamese" },
];

const IMAGE_STYLES = [
  {
    id: "photorealistic",
    name: "Photorealistic",
    preview: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=120&fit=crop",
  },
  {
    id: "clean-minimal",
    name: "Clean & Minimal",
    preview: "https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=120&fit=crop",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    preview: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=200&h=120&fit=crop",
  },
  {
    id: "3d-render",
    name: "3D Render",
    preview: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=120&fit=crop",
  },
  {
    id: "vintage",
    name: "Vintage",
    preview: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&h=120&fit=crop",
  },
  {
    id: "abstract",
    name: "Abstract",
    preview: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&h=120&fit=crop",
  },
];

// Language Dropdown Component
function LanguageDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLanguage = LANGUAGES.find(l => l.code === value) || LANGUAGES[0];

  return (
    <div className="py-4 border-b border-neutral-800">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{selectedLanguage.flag}</span>
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Content Language
          </label>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <span>{selectedLanguage.name}</span>
              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />

                {/* Dropdown */}
                <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-lg bg-neutral-800 border border-neutral-700 shadow-xl z-20 max-h-64 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onChange(lang.code);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/10 transition-colors ${
                        lang.code === value ? 'bg-purple-500/20 text-purple-300' : 'text-neutral-200'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                      {lang.code === value && (
                        <CheckCircle className="w-4 h-4 text-purple-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Editable Section Component
function EditableSection({
  label,
  value,
  onSave,
  isSaving,
}: {
  label: string;
  value: string;
  onSave: (value: string) => void;
  isSaving: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = async () => {
    await onSave(localValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setIsEditing(false);
  };

  return (
    <div className="py-6 border-b border-neutral-800">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-neutral-300">{label}</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-purple-400" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-neutral-200 text-sm leading-relaxed focus:outline-none focus:border-purple-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-white/10 text-neutral-300 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap">
          {value || "Not set"}
        </p>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const siteId = searchParams.get("siteId");

  const [site, setSite] = useState<Site | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generateImages, setGenerateImages] = useState(true);

  // WordPress form fields
  const [wpUsername, setWpUsername] = useState("");
  const [wpPassword, setWpPassword] = useState("");

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-publish settings
  const [autoPublishSettings, setAutoPublishSettings] = useState<AutoPublishSettings | null>(null);
  const [isUpdatingAutoPublish, setIsUpdatingAutoPublish] = useState(false);

  useEffect(() => {
    if (siteId) {
      fetchData();
    }
  }, [siteId]);

  const fetchData = async () => {
    try {
      // Fetch site
      const sitesResponse = await fetch("/api/seo-writer/sites");
      if (sitesResponse.ok) {
        const sites = await sitesResponse.json();
        const foundSite = sites.find((s: Site) => s.id === siteId);
        if (foundSite) {
          setSite(foundSite);
          setWpUsername(foundSite.username);
        }
      }

      // Fetch brand profile
      const profileResponse = await fetch(`/api/seo-writer/brand-profile?siteId=${siteId}`);
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setBrandProfile(profile);
      }

      // Fetch auto-publish settings
      const autoPublishResponse = await fetch(`/api/seo-writer/auto-publish?siteId=${siteId}`);
      if (autoPublishResponse.ok) {
        const settings = await autoPublishResponse.json();
        setAutoPublishSettings(settings);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAutoPublishSettings = async (updates: Partial<AutoPublishSettings>) => {
    if (!siteId) return;

    setIsUpdatingAutoPublish(true);
    setError(null);

    try {
      const response = await fetch("/api/seo-writer/auto-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          ...updates,
        }),
      });

      if (response.ok) {
        const settings = await response.json();
        setAutoPublishSettings(settings);
        setSuccess("Auto-publish settings updated");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to update auto-publish settings");
      }
    } catch (err) {
      setError("Failed to update auto-publish settings");
    } finally {
      setIsUpdatingAutoPublish(false);
    }
  };

  const updateBrandProfile = async (field: string, value: string | string[]) => {
    if (!brandProfile) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/seo-writer/brand-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          [field]: value,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setBrandProfile(updated);
        setSuccess("Saved successfully");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to save");
      }
    } catch (err) {
      setError("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/seo-writer/wordpress/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          url: site?.url,
          username: wpUsername,
          appPassword: wpPassword || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Connected successfully! User: ${data.user.name}`);
        setSite({ ...site!, isConnected: true, lastTestedAt: new Date().toISOString() });
      } else {
        setError(data.error || "Connection failed");
      }
    } catch (err) {
      setError("Failed to test connection");
    } finally {
      setIsTesting(false);
    }
  };

  const handleDeleteSite = async () => {
    if (!deleteConfirmed || !siteId) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/seo-writer/sites?siteId=${siteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Redirect to SEO Writer home after deletion
        router.push("/seo-writer");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete site");
        setShowDeleteModal(false);
      }
    } catch (err) {
      setError("Failed to delete site");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/seo-writer?siteId=${siteId}`}>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-neutral-400">{site?.name || site?.url}</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {success}
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Your Brand Section */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Your Brand</h2>
            <p className="text-neutral-400 text-sm">Language, audience, and content settings</p>
          </div>

          {/* Content Language */}
          <LanguageDropdown
            value={brandProfile?.language || "English"}
            onChange={(value) => updateBrandProfile("language", value)}
          />

          {/* Business Type */}
          <EditableSection
            label="Business Type"
            value={brandProfile?.brandDescription || ""}
            onSave={(value) => updateBrandProfile("brandDescription", value)}
            isSaving={isSaving}
          />

          {/* Brand Voice & Tone */}
          <EditableSection
            label="Brand Voice & Tone"
            value={brandProfile?.brandVoice || ""}
            onSave={(value) => updateBrandProfile("brandVoice", value)}
            isSaving={isSaving}
          />

          {/* Target Audience */}
          <EditableSection
            label="Target Audience"
            value={brandProfile?.targetAudience || ""}
            onSave={(value) => updateBrandProfile("targetAudience", value)}
            isSaving={isSaving}
          />

          {/* Create Images Toggle */}
          <div className="py-6 border-b border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-300">Create Images For My Articles</h3>
                <p className="text-neutral-500 text-xs mt-1">AI generates images for your articles</p>
              </div>
              <button
                onClick={() => setGenerateImages(!generateImages)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  generateImages ? "bg-purple-500" : "bg-neutral-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    generateImages ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Image Style */}
          {generateImages && (
            <div className="py-6">
              <h3 className="text-sm font-semibold text-neutral-300 mb-4">Image Style</h3>
              <div className="grid grid-cols-3 gap-3">
                {IMAGE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateBrandProfile("imageStyle", style.id)}
                    className={`relative rounded-xl overflow-hidden aspect-[16/10] group ${
                      brandProfile?.imageStyle === style.id
                        ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-neutral-900"
                        : "hover:ring-2 hover:ring-white/20 hover:ring-offset-2 hover:ring-offset-neutral-900"
                    }`}
                  >
                    <img
                      src={style.preview}
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-xs font-medium text-white">
                      {style.name}
                    </span>
                    {brandProfile?.imageStyle === style.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* WordPress Connection */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-400" />
            WordPress Connection
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Website URL
              </label>
              <input
                type="text"
                value={site?.url || ""}
                disabled
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-neutral-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                WordPress Username
              </label>
              <input
                type="text"
                value={wpUsername}
                onChange={(e) => setWpUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Application Password
              </label>
              <input
                type="password"
                value={wpPassword}
                onChange={(e) => setWpPassword(e.target.value)}
                placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Find in WordPress Admin → Users → Profile → Application Passwords
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {site?.isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">Connected</span>
                    {site.lastTestedAt && (
                      <span className="text-neutral-500 text-xs">
                        (tested {new Date(site.lastTestedAt).toLocaleDateString()})
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">Not connected</span>
                  </>
                )}
              </div>
              <motion.button
                onClick={testConnection}
                disabled={isTesting || !wpUsername}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isTesting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4" />
                )}
                Test Connection
              </motion.button>
            </div>
          </div>
        </div>

        {/* Auto-Publishing Settings */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Auto-Publishing
          </h2>
          <p className="text-neutral-400 text-sm mb-6">
            Automatically generate and publish articles from your keywords. Articles are generated daily to fill the next 7 days.
          </p>

          <div className="space-y-6">
            {/* Enable Auto-Publish Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-neutral-300">Enable Auto-Publishing</h3>
                <p className="text-neutral-500 text-xs mt-1">
                  Automatically generate articles from pending keywords
                </p>
              </div>
              <button
                onClick={() => updateAutoPublishSettings({ enabled: !autoPublishSettings?.enabled })}
                disabled={isUpdatingAutoPublish}
                className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 ${
                  autoPublishSettings?.enabled ? "bg-purple-500" : "bg-neutral-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    autoPublishSettings?.enabled ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            {autoPublishSettings?.enabled && (
              <>
                {/* Publish Time */}
                <div className="py-4 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-neutral-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Daily Publish Time
                      </label>
                      <select
                        value={autoPublishSettings?.publishTime || "09:00"}
                        onChange={(e) => updateAutoPublishSettings({ publishTime: e.target.value })}
                        disabled={isUpdatingAutoPublish}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 disabled:opacity-50"
                      >
                        <option value="06:00">6:00 AM</option>
                        <option value="07:00">7:00 AM</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Days Ahead */}
                <div className="py-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Days to Fill Ahead
                  </label>
                  <p className="text-neutral-500 text-xs mb-3">
                    How many days of content to keep scheduled
                  </p>
                  <div className="flex gap-2">
                    {[3, 5, 7, 14].map((days) => (
                      <button
                        key={days}
                        onClick={() => updateAutoPublishSettings({ daysAhead: days })}
                        disabled={isUpdatingAutoPublish}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                          autoPublishSettings?.daysAhead === days
                            ? "bg-purple-500 text-white"
                            : "bg-white/5 text-neutral-400 hover:bg-white/10"
                        }`}
                      >
                        {days} days
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Danger Zone</h2>
          <p className="text-neutral-500 text-sm mb-4">Irreversible actions</p>
          <motion.button
            onClick={() => setShowDeleteModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <Unplug className="w-4 h-4" />
            Disconnect Website
          </motion.button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => {
                if (!isDeleting) {
                  setShowDeleteModal(false);
                  setDeleteConfirmed(false);
                }
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-red-600">
                        Disconnect Website
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        if (!isDeleting) {
                          setShowDeleteModal(false);
                          setDeleteConfirmed(false);
                        }
                      }}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    This will permanently delete your website connection and all associated data.
                  </p>
                </div>

                {/* Warning Box */}
                <div className="px-6 pb-4">
                  <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-600 text-sm">
                        Warning: This cannot be undone
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {brandProfile?.brandName || site?.name || "This site"} will permanently lose:
                    </p>
                    <ul className="text-gray-600 text-sm space-y-1 ml-4">
                      <li className="list-disc">All your articles and generated content</li>
                      <li className="list-disc">All keywords and research data</li>
                      <li className="list-disc">All scheduled content</li>
                      <li className="list-disc font-semibold text-gray-800">
                        All SEO knowledge and brand understanding
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Confirmation Toggle */}
                <div className="px-6 pb-4">
                  <div className="p-4 rounded-xl bg-gray-50 flex items-start gap-3">
                    <button
                      onClick={() => setDeleteConfirmed(!deleteConfirmed)}
                      className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${
                        deleteConfirmed ? "bg-red-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform mx-1 mt-1 ${
                          deleteConfirmed ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                    <div>
                      <p className="text-gray-800 text-sm font-medium">
                        I understand that all data will be permanently deleted
                      </p>
                      <p className="text-gray-500 text-xs">
                        Including all SEO knowledge about my brand
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmed(false);
                    }}
                    disabled={isDeleting}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleDeleteSite}
                    disabled={!deleteConfirmed || isDeleting}
                    whileHover={deleteConfirmed ? { scale: 1.02 } : {}}
                    whileTap={deleteConfirmed ? { scale: 0.98 } : {}}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Unplug className="w-4 h-4" />
                    )}
                    {isDeleting ? "Deleting..." : "Disconnect & Delete All"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
