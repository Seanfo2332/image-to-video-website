"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Users, Menu, X, Sparkles, LogOut, Settings, Shield, User, ChevronDown, Wand2, LayoutDashboard } from "lucide-react";

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
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-10"
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
                  className="px-4 py-2 text-sm text-slate-500 hover:text-[#0ABAB5] transition-colors relative group rounded-lg hover:bg-slate-50"
                >
                  {item.name}
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#0ABAB5] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {status === "loading" ? (
                <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ABAB5] to-[#089691] flex items-center justify-center overflow-hidden">
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
                    <span className="text-sm text-[#1E293B] font-medium max-w-[100px] truncate">
                      {session.user?.name || session.user?.email?.split("@")[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 py-2 rounded-xl bg-white backdrop-blur-xl border border-slate-200 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm text-[#1E293B] font-medium truncate">
                            {session.user?.name || "User"}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {session.user?.email}
                          </p>
                        </div>

                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-[#0ABAB5] hover:bg-slate-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>

                        {session.user?.role === "admin" && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-[#0ABAB5] hover:bg-slate-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}

                        <Link
                          href="/dashboard/create"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-[#0ABAB5] hover:bg-slate-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Wand2 className="w-4 h-4" />
                          Prompt Generator
                        </Link>

                        <div className="my-2 border-t border-slate-100" />

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
                    className="px-4 py-2 text-sm text-slate-600 hover:text-[#0ABAB5] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link href="/generate">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-5 py-2.5 rounded-full bg-[#0ABAB5] hover:bg-[#089691] text-white text-sm font-medium shadow-lg shadow-[#0ABAB5]/25 flex items-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      Get Started
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#1E293B] rounded-lg hover:bg-slate-100"
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
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-xl pt-20 px-4 md:hidden"
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
                    className="block py-4 px-4 text-xl text-[#1E293B] font-medium rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 mt-4 border-t border-slate-200 flex flex-col gap-4"
              >
                {session ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0ABAB5] to-[#089691] flex items-center justify-center overflow-hidden">
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
                        <p className="text-[#1E293B] font-medium">{session.user?.name || "User"}</p>
                        <p className="text-sm text-slate-500">{session.user?.email}</p>
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
                        className="py-3 text-center text-lg text-purple-600 rounded-xl border border-purple-200 bg-purple-50 flex items-center justify-center gap-2"
                      >
                        <Shield className="w-5 h-5" />
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/dashboard/create" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg flex items-center justify-center gap-2">
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
                      className="py-3 text-center text-lg text-slate-600 rounded-xl border border-slate-200"
                    >
                      Sign In
                    </Link>
                    <Link href="/generate" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-4 rounded-xl bg-[#0ABAB5] text-white font-semibold text-lg flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
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
