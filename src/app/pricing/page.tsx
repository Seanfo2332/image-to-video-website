"use client";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Image, Video, Mic, Coins, Check } from "lucide-react";
import Link from "next/link";

const packages = [
  {
    name: "Starter",
    credits: 50,
    price: 1,
    popular: false,
    description: "Try out the platform",
  },
  {
    name: "Popular",
    credits: 120,
    price: 5,
    popular: true,
    description: "Best value for creators",
  },
  {
    name: "Pro",
    credits: 300,
    price: 10,
    popular: false,
    description: "For power users",
  },
  {
    name: "Max",
    credits: 800,
    price: 25,
    popular: false,
    description: "Maximum credits, best rate",
  },
  {
    name: "Ultra",
    credits: 2000,
    price: 50,
    popular: false,
    description: "Best rate per credit",
  },
];

const creditCosts = [
  {
    icon: Image,
    label: "Image Generation",
    cost: 1,
    description: "Generate AI images from text prompts",
  },
  {
    icon: Mic,
    label: "Lip Sync Video",
    cost: 2,
    description: "Sync audio to video with AI lip sync",
  },
  {
    icon: Video,
    label: "Video Generation",
    cost: 3,
    description: "Create AI-powered videos from prompts",
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
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-xs font-medium uppercase tracking-wider text-[#334155] mb-6">
              <Coins className="w-4 h-4 text-[#0ABAB5]" />
              Simple Pricing
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1A1A2E] mb-6">
              Pay As You Go
            </h1>
            <p className="text-lg text-[#334155] max-w-2xl mx-auto">
              Buy credits and use them whenever you want. No subscriptions, no
              monthly fees. Only pay for what you use.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Credit Packages */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl border ${
                  pkg.popular
                    ? "border-[#0ABAB5] shadow-lg shadow-[#0ABAB5]/10"
                    : "border-[#E2E8F0] hover:border-[#0ABAB5]/20"
                } p-8 flex flex-col transition-all duration-300 hover:shadow-lg`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-full bg-[#0ABAB5] text-white text-xs font-semibold uppercase tracking-wider">
                      Best Value
                    </div>
                  </div>
                )}

                <div className="w-12 h-12 rounded-xl bg-[#D1F5F3] flex items-center justify-center mb-6">
                  <Coins className="w-6 h-6 text-[#0ABAB5]" />
                </div>

                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-1">
                  {pkg.name}
                </h3>
                <p className="text-sm text-[#334155] mb-6">{pkg.description}</p>

                <div className="mb-1">
                  <span className="text-4xl font-bold text-[#1A1A2E]">
                    {pkg.credits}
                  </span>
                  <span className="text-[#334155] ml-2">credits</span>
                </div>
                <div className="mb-8">
                  <span className="text-2xl font-semibold text-[#0ABAB5]">
                    RM {pkg.price.toFixed(2)}
                  </span>
                  <span className="text-slate-400 text-xs ml-2">
                    RM{(pkg.price / pkg.credits).toFixed(2)}/credit
                  </span>
                </div>

                <div className="mt-auto">
                  <Link href="/register">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                        pkg.popular
                          ? "bg-[#0ABAB5] hover:bg-[#089691] text-white shadow-lg shadow-[#0ABAB5]/20"
                          : "border border-[#E2E8F0] bg-white text-[#1A1A2E] hover:border-[#0ABAB5] hover:bg-[#D1F5F3]/30"
                      }`}
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Credits Work */}
      <section className="py-24 px-4 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-xs font-medium uppercase tracking-wider text-[#334155] mb-6">
              <div className="w-2 h-2 rounded-full bg-[#0ABAB5]" />
              How It Works
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E]">
              How Credits Work
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            {creditCosts.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center hover:shadow-lg hover:border-[#0ABAB5]/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[#D1F5F3] flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-[#0ABAB5]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">
                  {item.label}
                </h3>
                <p className="text-sm text-[#334155] mb-4">
                  {item.description}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D1F5F3] text-[#0ABAB5] font-semibold">
                  {item.cost} {item.cost === 1 ? "credit" : "credits"}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-[#334155] mt-10 text-sm"
          >
            New accounts receive{" "}
            <span className="font-semibold text-[#0ABAB5]">
              10 free credits
            </span>{" "}
            as a welcome bonus.
          </motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-xs font-medium uppercase tracking-wider text-[#334155] mb-6">
              <div className="w-2 h-2 rounded-full bg-[#0ABAB5]" />
              FAQ
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E]">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-lg hover:border-[#0ABAB5]/20 transition-all duration-300"
              >
                <h4 className="text-lg font-semibold text-[#1A1A2E] mb-2">
                  {faq.q}
                </h4>
                <p className="text-[#334155]">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-[#F1F5F9]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg p-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-4">
              Ready to Create?
            </h2>
            <p className="text-[#334155] mb-8">
              Sign up now and get 10 free credits to start generating.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium text-lg shadow-lg shadow-[#0ABAB5]/20 transition-all duration-300"
                >
                  Sign Up Free
                </motion.button>
              </Link>
              <Link href="/dashboard/billing">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl border border-[#E2E8F0] bg-white text-[#1A1A2E] font-medium text-lg hover:border-[#0ABAB5] hover:bg-[#D1F5F3]/30 transition-all duration-300"
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
