"use client";
import Link from "next/link";
import { Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

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
    <footer className="bg-white border-t border-[#E2E8F0] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo & description */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/alphafin-full-logo.png" alt="AlphaFin" className="h-9 w-auto" />
            </Link>
            <p className="text-[#334155] text-sm mb-6 max-w-xs leading-relaxed">
              Create professional AI avatar videos in minutes. 100+ lifelike avatars,
              175+ languages, natural lip-sync.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center hover:bg-[#D1F5F3] hover:border-[#0ABAB5]/20 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-[#334155]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-[#1A1A2E] mb-4 text-sm">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#334155] hover:text-[#0ABAB5] transition-colors"
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
        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#334155]">
            &copy; {new Date().getFullYear()} AlphaFin. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <p className="text-sm text-[#334155]">
              Premium AI-powered video platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
