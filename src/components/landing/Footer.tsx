"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Twitter, Github, Linkedin, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Avatars", href: "#avatars" },
    { name: "API", href: "#" },
  ],
  "Use Cases": [
    { name: "Marketing", href: "#" },
    { name: "E-learning", href: "#" },
    { name: "Sales", href: "#" },
    { name: "Social Media", href: "#" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Avatar Gallery", href: "#avatars" },
    { name: "Tutorials", href: "#" },
  ],
  Legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Cookies", href: "#" },
    { name: "Licenses", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo & description */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/alphafin-full-logo.png" alt="AlphaFin" className="h-10 w-auto" />
            </Link>
            <p className="text-slate-500 text-sm mb-6 max-w-xs">
              Create professional AI avatar videos in minutes. 100+ lifelike avatars,
              175+ languages, natural lip-sync.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-[#D1F5F3] hover:border-[#0ABAB5]/20 transition-colors"
                >
                  <social.icon className="w-4 h-4 text-slate-500 hover:text-[#0ABAB5]" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-[#1E293B] mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-[#0ABAB5] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} AlphaFin. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Made with AI-powered avatars
          </p>
        </div>
      </div>
    </footer>
  );
}
