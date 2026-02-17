"use client";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SparklesCore } from "@/components/ui/sparkles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Sparkles,
  Zap,
  Crown,
  Star,
  Image,
  Video,
  Mic,
} from "lucide-react";
import Link from "next/link";

const packages = [
  {
    name: "Starter",
    credits: 50,
    price: 0.1,
    icon: Sparkles,
    color: "from-gray-500 to-gray-600",
    popular: false,
    description: "Try out the platform",
  },
  {
    name: "Popular",
    credits: 120,
    price: 0.3,
    icon: Zap,
    color: "from-violet-500 to-purple-500",
    popular: true,
    description: "Best value for creators",
  },
  {
    name: "Pro",
    credits: 300,
    price: 0.5,
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    popular: false,
    description: "For power users",
  },
  {
    name: "Max",
    credits: 800,
    price: 1.0,
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    popular: false,
    description: "Maximum credits, best rate",
  },
];

const creditCosts = [
  {
    icon: Image,
    label: "Image Generation",
    cost: 1,
    color: "text-green-400",
  },
  {
    icon: Mic,
    label: "Lip Sync Video",
    cost: 2,
    color: "text-blue-400",
  },
  {
    icon: Video,
    label: "Video Generation",
    cost: 3,
    color: "text-purple-400",
  },
];

const faqs = [
  {
    q: "What are credits?",
    a: "Credits are the currency used on our platform. Each AI generation costs a certain number of credits depending on the type — images cost 1 credit, lip sync costs 2, and video generation costs 3.",
  },
  {
    q: "Do credits expire?",
    a: "No! Your credits never expire. Use them whenever you're ready.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept online banking (FPX), e-wallets, and credit/debit cards via our Malaysian payment gateway. All prices are in Ringgit Malaysia (RM).",
  },
  {
    q: "Can I buy more credits anytime?",
    a: "Yes! You can top up credits at any time from your dashboard billing page. There are no subscriptions or recurring charges.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
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
              Pay As You Go
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Buy credits and use them whenever you want. No subscriptions, no
              monthly fees. Only pay for what you use.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Credit Packages */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl ${
                  pkg.popular
                    ? "bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/50"
                    : "bg-neutral-900/50 border-white/5"
                } border p-8 flex flex-col`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium">
                      Best Value
                    </div>
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6`}
                >
                  <pkg.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">
                  {pkg.name}
                </h3>
                <p className="text-neutral-400 text-sm mb-6">
                  {pkg.description}
                </p>

                <div className="mb-2">
                  <span className="text-4xl font-bold text-white">
                    {pkg.credits}
                  </span>
                  <span className="text-neutral-400 ml-2">credits</span>
                </div>
                <div className="mb-8">
                  <span className="text-2xl font-semibold text-white">
                    RM {pkg.price.toFixed(2)}
                  </span>
                  <span className="text-neutral-500 text-sm ml-2">
                    (RM{" "}
                    {(pkg.price / pkg.credits).toFixed(4).replace(/0+$/, "")}/credit)
                  </span>
                </div>

                <div className="mt-auto">
                  {pkg.popular ? (
                    <Link href="/register">
                      <ShimmerButton
                        className="w-full"
                        shimmerColor="#a855f7"
                        background="linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)"
                      >
                        <span className="text-white font-medium">
                          Get Started
                        </span>
                      </ShimmerButton>
                    </Link>
                  ) : (
                    <Link href="/register">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
                      >
                        Get Started
                      </motion.button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Credits Work */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-white mb-12"
          >
            How Credits Work
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {creditCosts.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-neutral-900/50 border border-white/5 rounded-xl p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.label}
                </h3>
                <p className="text-3xl font-bold text-white">
                  {item.cost}{" "}
                  <span className="text-base font-normal text-neutral-400">
                    {item.cost === 1 ? "credit" : "credits"}
                  </span>
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-neutral-500 mt-8 text-sm"
          >
            New accounts receive 10 free credits as a welcome bonus.
          </motion.p>
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
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-neutral-900/50 border border-white/5 rounded-xl p-6"
              >
                <h4 className="text-lg font-medium text-white mb-2">
                  {faq.q}
                </h4>
                <p className="text-neutral-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Create?
            </h2>
            <p className="text-neutral-400 mb-8">
              Sign up now and get 10 free credits to start generating.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <ShimmerButton
                  shimmerColor="#a855f7"
                  background="linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)"
                >
                  <span className="text-white font-medium px-4">
                    Sign Up Free
                  </span>
                </ShimmerButton>
              </Link>
              <Link href="/dashboard/billing">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-3 px-6 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
                >
                  Go to Billing
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
