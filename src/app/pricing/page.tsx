"use client";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SparklesCore } from "@/components/ui/sparkles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for trying out our platform",
    price: { monthly: 0, yearly: 0 },
    icon: Sparkles,
    color: "from-gray-500 to-gray-600",
    features: [
      "5 videos per month",
      "720p resolution",
      "Basic templates",
      "Watermark included",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    description: "For creators who need more power",
    price: { monthly: 29, yearly: 290 },
    icon: Zap,
    color: "from-violet-500 to-purple-500",
    features: [
      "50 videos per month",
      "1080p resolution",
      "All templates",
      "No watermark",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and businesses",
    price: { monthly: 99, yearly: 990 },
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    features: [
      "Unlimited videos",
      "4K resolution",
      "Custom templates",
      "White label",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Team collaboration",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Sparkles background */}
        <div className="absolute inset-0">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={30}
            className="w-full h-full"
            particleColor="#8b5cf6"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your video creation needs.
              All plans include a 7-day free trial.
            </p>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-4"
          >
            <span
              className={`text-sm ${
                !isYearly ? "text-white" : "text-neutral-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full bg-neutral-800 border border-white/10 transition-colors"
            >
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                animate={{ left: isYearly ? "calc(100% - 24px)" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={`text-sm ${
                isYearly ? "text-white" : "text-neutral-500"
              }`}
            >
              Yearly
              <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                Save 20%
              </span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl ${
                  plan.popular
                    ? "bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/50"
                    : "bg-neutral-900/50 border-white/5"
                } border p-8`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}
                >
                  <plan.icon className="w-6 h-6 text-white" />
                </div>

                {/* Plan info */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-neutral-400 text-sm mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-4xl md:text-5xl font-bold text-white">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-neutral-400 ml-2">
                      /{isYearly ? "year" : "month"}
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                {plan.popular ? (
                  <ShimmerButton
                    className="w-full mb-8"
                    shimmerColor="#a855f7"
                    background="linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)"
                  >
                    <span className="text-white font-medium">{plan.cta}</span>
                  </ShimmerButton>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors mb-8"
                  >
                    {plan.cta}
                  </motion.button>
                )}

                {/* Features */}
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-neutral-300"
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-white mb-12"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes! All paid plans come with a 7-day free trial. No credit card required to start.",
              },
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Absolutely. You can change your plan at any time and the pricing will be prorated.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-neutral-900/50 border border-white/5 rounded-xl p-6"
              >
                <h4 className="text-lg font-medium text-white mb-2">{faq.q}</h4>
                <p className="text-neutral-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
