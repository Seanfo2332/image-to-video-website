"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  User,
  Shield,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle,
  Coins,
} from "lucide-react";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  isActive: boolean;
  credits: number;
  createdAt: string;
  lastLoginAt: string | null;
  provider: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [isActive, setIsActive] = useState(true);

  // Credit adjustment
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditReason, setCreditReason] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [creditMessage, setCreditMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setName(data.name || "");
          setRole(data.role);
          setIsActive(data.isActive);
        } else {
          setError("User not found");
        }
      } catch {
        setError("Failed to fetch user");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, isActive }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("User updated successfully");
        setUser((prev) => (prev ? { ...prev, name, role, isActive } : null));
      } else {
        setError(data.error || "Failed to update user");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreditAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creditAmount === 0) return;
    setIsAdjusting(true);
    setCreditMessage(null);

    try {
      const res = await fetch("/api/admin/credits/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: creditAmount,
          reason: creditReason || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCreditMessage({ type: "success", text: `Credits updated. New balance: ${data.newBalance}` });
        setUser((prev) => prev ? { ...prev, credits: data.newBalance } : null);
        setCreditAmount(0);
        setCreditReason("");
      } else {
        setCreditMessage({ type: "error", text: data.error });
      }
    } catch {
      setCreditMessage({ type: "error", text: "Failed to adjust credits" });
    } finally {
      setIsAdjusting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error || "User not found"}</p>
        <Link
          href="/admin/users"
          className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block"
        >
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit User</h1>
          <p className="text-neutral-400">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-2xl p-6"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center overflow-hidden mb-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || user.email}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <h2 className="text-xl font-bold text-white">
              {user.name || "No name"}
            </h2>
            <p className="text-neutral-400 mb-4">{user.email}</p>

            <div className="flex gap-2 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === "admin"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-neutral-500/20 text-neutral-400"
                }`}
              >
                {user.role === "admin" && <Shield className="w-3 h-3 inline mr-1" />}
                {user.role}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.isActive
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="w-full space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-neutral-500">Provider</span>
                <span className="text-white capitalize">{user.provider}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-neutral-500">Joined</span>
                <span className="text-white">
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-neutral-500">Last Login</span>
                <span className="text-white">
                  {user.lastLoginAt
                    ? format(new Date(user.lastLoginAt), "MMM d, yyyy HH:mm")
                    : "Never"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500">Credits</span>
                <span className="text-yellow-400 font-semibold flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  {user.credits}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 liquid-glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">
            Edit User Details
          </h3>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                placeholder="User name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              >
                <option value="user" className="bg-neutral-900">
                  User
                </option>
                <option value="admin" className="bg-neutral-900">
                  Admin
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={isActive}
                    onChange={() => setIsActive(true)}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <span className="text-white">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isActive}
                    onChange={() => setIsActive(false)}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <span className="text-white">Inactive</span>
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Credit Adjustment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 liquid-glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Coins className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Adjust Credits</h3>
            <span className="ml-auto text-sm text-neutral-400">
              Current balance: <span className="text-yellow-400 font-semibold">{user.credits}</span>
            </span>
          </div>

          {creditMessage && (
            <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
              creditMessage.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {creditMessage.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm">{creditMessage.text}</p>
            </div>
          )}

          <form onSubmit={handleCreditAdjust} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Amount (positive to add, negative to deduct)
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                placeholder="e.g. 10 or -5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Reason (optional)
              </label>
              <input
                type="text"
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                placeholder="e.g. Bonus credits"
              />
            </div>
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isAdjusting || creditAmount === 0}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAdjusting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Coins className="w-5 h-5" />
                    Adjust Credits
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
