"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Coins,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

type PaymentStatus = "checking" | "completed" | "failed" | "pending";

export default function PaymentCompletePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status"); // From Revenue Monster redirect

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("checking");
  const [credits, setCredits] = useState<number>(0);
  const [newBalance, setNewBalance] = useState<number>(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setPaymentStatus("failed");
      return;
    }

    // If Revenue Monster already told us it failed/cancelled
    if (status === "FAILED" || status === "CANCELLED") {
      setPaymentStatus("failed");
      return;
    }

    checkPaymentStatus();
  }, [orderId, status]);

  const checkPaymentStatus = async () => {
    if (!orderId) return;

    try {
      const res = await fetch(`/api/topup/status?orderId=${orderId}`);
      const data = await res.json();

      if (data.status === "completed") {
        setPaymentStatus("completed");
        setCredits(data.credits);
        setNewBalance(data.newBalance);
      } else if (data.status === "failed") {
        setPaymentStatus("failed");
      } else if (data.status === "pending") {
        // If still pending, retry a few times
        if (retryCount < 5) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            checkPaymentStatus();
          }, 2000);
        } else {
          setPaymentStatus("pending");
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setPaymentStatus("failed");
    }
  };

  const handleRetry = () => {
    setPaymentStatus("checking");
    setRetryCount(0);
    checkPaymentStatus();
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md liquid-glass rounded-2xl p-8 text-center"
      >
        {/* Checking Status */}
        {paymentStatus === "checking" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verifying Payment
            </h1>
            <p className="text-neutral-400 mb-6">
              Please wait while we confirm your payment...
            </p>
          </>
        )}

        {/* Success */}
        {paymentStatus === "completed" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-neutral-400 mb-6">
              Your credits have been added to your account.
            </p>

            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-lg font-bold text-white">
                  +{credits} Credits
                </span>
              </div>
              <p className="text-sm text-neutral-400">
                New Balance: <span className="text-white font-semibold">{newBalance} credits</span>
              </p>
            </div>

            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Billing
            </Link>
          </>
        )}

        {/* Failed */}
        {paymentStatus === "failed" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center"
            >
              <XCircle className="w-8 h-8 text-red-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Payment Failed
            </h1>
            <p className="text-neutral-400 mb-6">
              Your payment could not be processed. Please try again.
            </p>

            <div className="flex gap-3 justify-center">
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Billing
              </Link>
            </div>
          </>
        )}

        {/* Pending */}
        {paymentStatus === "pending" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Payment Processing
            </h1>
            <p className="text-neutral-400 mb-6">
              Your payment is still being processed. This may take a moment.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-medium hover:bg-yellow-500/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Check Again
              </button>
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Billing
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
