"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Coins,
  History,
  Gift,
  Loader2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  CreditCard,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

interface CreditConfig {
  workflowType: string;
  cost: number;
  label: string;
}

interface TopUpPackage {
  id: string;
  credits: number;
  price: number;
  currency: string;
  popular: boolean;
}

export default function BillingPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [configs, setConfigs] = useState<CreditConfig[]>([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpPackages, setTopUpPackages] = useState<TopUpPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);
  const [topUpMessage, setTopUpMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchCredits();
    fetchTransactions(1);
    fetchConfigs();
  }, []);

  const fetchCredits = async () => {
    const res = await fetch("/api/credits");
    if (res.ok) {
      const data = await res.json();
      setCredits(data.credits);
    }
  };

  const fetchTransactions = async (p: number) => {
    const res = await fetch(`/api/credits/transactions?page=${p}&limit=10`);
    if (res.ok) {
      const data = await res.json();
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
      setPage(data.page);
    }
  };

  const fetchConfigs = async () => {
    const res = await fetch("/api/credits/config");
    if (res.ok) {
      const data = await res.json();
      setConfigs(data.configs);
    }
  };

  const fetchPackages = async () => {
    const res = await fetch("/api/topup/packages");
    if (res.ok) {
      const data = await res.json();
      setTopUpPackages(data.packages);
    }
  };

  const openTopUpModal = () => {
    setSelectedPackage(null);
    setTopUpMessage(null);
    fetchPackages();
    setShowTopUpModal(true);
  };

  const handleTopUp = async () => {
    if (!selectedPackage) return;
    setIsProcessingTopUp(true);
    setTopUpMessage(null);

    try {
      // Create checkout session with Revenue Monster
      const res = await fetch("/api/topup/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: selectedPackage }),
      });
      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        // Redirect to Revenue Monster payment page
        window.location.href = data.checkoutUrl;
      } else {
        setTopUpMessage({ type: "error", text: data.error || "Failed to create checkout" });
        setIsProcessingTopUp(false);
      }
    } catch {
      setTopUpMessage({ type: "error", text: "Failed to process top-up" });
      setIsProcessingTopUp(false);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    setIsRedeeming(true);
    setMessage(null);

    try {
      const res = await fetch("/api/credits/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: `Added ${data.creditsAdded} credits! New balance: ${data.newBalance}` });
        setCredits(data.newBalance);
        setVoucherCode("");
        fetchTransactions(1);
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to redeem voucher" });
    } finally {
      setIsRedeeming(false);
    }
  };

  const typeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deduction: "Usage",
      refund: "Refund",
      admin_adjustment: "Admin Adjustment",
      voucher_redemption: "Voucher",
      signup_bonus: "Signup Bonus",
      topup: "Top Up",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Billing & Credits</h1>
        <p className="text-neutral-400 mt-1">Manage your credits and redeem vouchers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credit Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Credit Balance</p>
              <p className="text-3xl font-bold text-white">
                {credits !== null ? credits : <Loader2 className="w-6 h-6 animate-spin" />}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Workflow Costs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="liquid-glass rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
            Workflow Costs
          </h3>
          <div className="space-y-3">
            {configs.map((c) => (
              <div key={c.workflowType} className="flex justify-between items-center">
                <span className="text-white">{c.label}</span>
                <span className="text-yellow-400 font-semibold">{c.cost} credits</span>
              </div>
            ))}
            {configs.length === 0 && (
              <p className="text-neutral-500 text-sm">No workflow costs configured</p>
            )}
          </div>
        </motion.div>

        {/* Voucher Redemption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
              Redeem Voucher
            </h3>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleRedeem} className="flex gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Enter voucher code"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 transition-all uppercase"
            />
            <button
              type="submit"
              disabled={isRedeeming || !voucherCode.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRedeeming ? <Loader2 className="w-5 h-5 animate-spin" /> : "Redeem"}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Top Up Credits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="liquid-glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Top Up Credits</h3>
              <p className="text-sm text-neutral-400">Purchase additional credits instantly</p>
            </div>
          </div>
          <button
            onClick={openTopUpModal}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            Top Up
          </button>
        </div>
      </motion.div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isProcessingTopUp && setShowTopUpModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg liquid-glass rounded-2xl p-6 z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Choose a Package</h2>
              <button
                onClick={() => !isProcessingTopUp && setShowTopUpModal(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {topUpMessage && (
              <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${
                topUpMessage.type === "success"
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                {topUpMessage.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {topUpMessage.text}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              {topUpPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  disabled={isProcessingTopUp}
                  className={`relative p-4 rounded-xl border text-left transition-all ${
                    selectedPackage === pkg.id
                      ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                  <p className="text-2xl font-bold text-white">{pkg.credits}</p>
                  <p className="text-sm text-neutral-400">credits</p>
                  <p className="text-lg font-semibold text-emerald-400 mt-2">RM{pkg.price}</p>
                  <p className="text-xs text-neutral-500">
                    RM{(pkg.price / pkg.credits).toFixed(2)}/credit
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={handleTopUp}
              disabled={!selectedPackage || isProcessingTopUp}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isProcessingTopUp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to Payment...
                </>
              ) : (
                <>
                  Proceed to Payment
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-xs text-neutral-500 text-center mt-2">
              You will be redirected to Revenue Monster to complete payment
            </p>
          </motion.div>
        </div>
      )}

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="liquid-glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        </div>

        {transactions.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">No transactions yet</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Description</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-sm text-neutral-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          tx.type === "deduction"
                            ? "bg-red-500/20 text-red-400"
                            : tx.type === "refund"
                            ? "bg-blue-500/20 text-blue-400"
                            : tx.type === "topup"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-green-500/20 text-green-400"
                        }`}>
                          {typeLabel(tx.type)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-white">{tx.description}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`flex items-center justify-end gap-1 font-semibold ${
                          tx.amount > 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          {tx.amount > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {tx.amount > 0 ? "+" : ""}{tx.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => fetchTransactions(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-neutral-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => fetchTransactions(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
