"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Plus,
  Loader2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface Voucher {
  id: string;
  code: string;
  credits: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  _count: { redemptions: number };
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Create form
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState(10);
  const [maxUses, setMaxUses] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    const res = await fetch("/api/admin/vouchers");
    if (res.ok) {
      const data = await res.json();
      setVouchers(data.vouchers);
    }
    setIsLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setMessage(null);

    const res = await fetch("/api/admin/vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        credits,
        maxUses,
        expiresAt: expiresAt || null,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage({ type: "success", text: `Voucher "${data.voucher.code}" created` });
      setCode("");
      setCredits(10);
      setMaxUses(1);
      setExpiresAt("");
      fetchVouchers();
    } else {
      setMessage({ type: "error", text: data.error });
    }
    setIsCreating(false);
  };

  const toggleActive = async (voucher: Voucher) => {
    const res = await fetch(`/api/admin/vouchers/${voucher.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !voucher.isActive }),
    });
    if (res.ok) {
      fetchVouchers();
    }
  };

  const deleteVoucher = async (id: string) => {
    if (!confirm("Delete this voucher? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/vouchers/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchVouchers();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#0ABAB5]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">Voucher Management</h1>
        <p className="text-slate-500 mt-1">Create and manage voucher codes</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
            : "bg-red-50 border border-red-200 text-red-600"
        }`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Create Voucher Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <Plus className="w-5 h-5 text-violet-500" />
          <h3 className="text-lg font-semibold text-[#1E293B]">Create Voucher</h3>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="e.g. WELCOME50"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Credits</label>
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(parseInt(e.target.value) || 0)}
              required
              min={1}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#1E293B] focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Max Uses</label>
            <input
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)}
              required
              min={1}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#1E293B] focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Expires At (optional)</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#1E293B] focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2.5 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create Voucher
            </button>
          </div>
        </form>
      </motion.div>

      {/* Vouchers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <Gift className="w-5 h-5 text-violet-500" />
          <h3 className="text-lg font-semibold text-[#1E293B]">All Vouchers</h3>
        </div>

        {vouchers.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No vouchers created yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Code</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Credits</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Usage</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Expires</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v) => (
                  <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-[#1E293B] bg-slate-100 px-2 py-1 rounded">{v.code}</span>
                    </td>
                    <td className="py-3 px-4 text-amber-600 font-semibold">{v.credits}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {v.usedCount} / {v.maxUses}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        v.isActive ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                      }`}>
                        {v.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {v.expiresAt ? new Date(v.expiresAt).toLocaleDateString() : "Never"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleActive(v)}
                          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          title={v.isActive ? "Deactivate" : "Activate"}
                        >
                          {v.isActive ? (
                            <ToggleRight className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteVoucher(v.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
