"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, Shield, User, ChevronDown, Wand2, LayoutDashboard } from "lucide-react";

const navItems = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsUserMenuOpen(false);
    if (isUserMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isUserMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="h-9"
              >
                <img src="/alphafin-full-logo.png" alt="AlphaFin" className="h-full w-auto" />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm text-[#334155] hover:text-[#0ABAB5] transition-colors relative group"
                >
                  {item.name}
                  {/* Elegant underline animation */}
                  <span className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-[#0ABAB5] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {status === "loading" ? (
                <div className="w-8 h-8 rounded-full bg-[#F1F5F9] animate-pulse" />
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#E2E8F0] hover:border-[#0ABAB5]/30 transition-all shadow-sm"
                  >
                    {/* Gold ring accent on avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ABAB5] to-[#089691] flex items-center justify-center overflow-hidden ring-2 ring-[#D4AF37]/30">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm text-[#1A1A2E] font-medium max-w-[100px] truncate">
                      {session.user?.name || session.user?.email?.split("@")[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#334155] transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-premium-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-4 py-3 border-b border-[#E2E8F0]">
                          <p className="text-sm text-[#1A1A2E] font-medium truncate">
                            {session.user?.name || "User"}
                          </p>
                          <p className="text-xs text-[#334155] truncate">
                            {session.user?.email}
                          </p>
                        </div>

                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#334155] hover:text-[#0ABAB5] hover:bg-[#F1F5F9] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>

                        {session.user?.role === "admin" && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#334155] hover:text-[#0ABAB5] hover:bg-[#F1F5F9] transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}

                        <Link
                          href="/dashboard/create"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#334155] hover:text-[#0ABAB5] hover:bg-[#F1F5F9] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Wand2 className="w-4 h-4" />
                          Prompt Generator
                        </Link>

                        <div className="my-2 border-t border-[#E2E8F0]" />

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm text-[#334155] hover:text-[#0ABAB5] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link href="/generate">
                    <button className="px-5 py-2.5 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white text-sm font-medium shadow-lg shadow-[#0ABAB5]/20 transition-all duration-200">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#1A1A2E] rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-4 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-4 px-4 text-xl text-[#1A1A2E] font-medium rounded-xl hover:bg-[#F1F5F9] transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 mt-4 border-t border-[#E2E8F0] flex flex-col gap-4"
              >
                {session ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F1F5F9]">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0ABAB5] to-[#089691] flex items-center justify-center overflow-hidden ring-2 ring-[#D4AF37]/30">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-[#1A1A2E] font-medium">{session.user?.name || "User"}</p>
                        <p className="text-sm text-[#334155]">{session.user?.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-4 rounded-xl bg-[#0ABAB5] text-white font-semibold text-lg flex items-center justify-center gap-2">
                        <LayoutDashboard className="w-5 h-5" />
                        Go to Dashboard
                      </button>
                    </Link>
                    {session.user?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-3 text-center text-lg text-[#1E3A5F] rounded-xl border border-[#1E3A5F]/20 bg-[#1E3A5F]/5 flex items-center justify-center gap-2"
                      >
                        <Shield className="w-5 h-5" />
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/dashboard/create" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-4 rounded-xl bg-[#D4AF37] text-[#1A1A2E] font-semibold text-lg flex items-center justify-center gap-2">
                        <Wand2 className="w-5 h-5" />
                        Prompt Generator
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="py-3 text-center text-lg text-red-500 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3 text-center text-lg text-[#334155] rounded-xl border border-[#E2E8F0]"
                    >
                      Sign In
                    </Link>
                    <Link href="/generate" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-4 rounded-xl bg-[#0ABAB5] text-white font-semibold text-lg flex items-center justify-center gap-2">
                        Get Started
                      </button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
