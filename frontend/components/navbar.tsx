"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/link-button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact Us" },
];

export function Navbar({ variant = "marketing" }: { variant?: "marketing" | "app" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 h-16">
      {/* ── Full-width bar (at top) ── */}
      <motion.header
        animate={
          scrolled
            ? { opacity: 0, y: -8, pointerEvents: "none" }
            : { opacity: 1, y: 0, pointerEvents: "auto" }
        }
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute inset-x-0 top-0 border-b border-[#252840] bg-[#12141f]/90 backdrop-blur-md"
        style={{ position: "absolute" }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/OralSense AI Logo.png"
              alt="OralSense AI"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {variant === "marketing" && (
            <>
              <nav className="hidden items-center gap-8 md:flex">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium text-[#a0a8b8] transition-colors duration-200 hover:text-white",
                      pathname === link.href && "text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="hidden items-center gap-3 md:flex">
                <LinkButton href="/login" variant="ghost" className="text-[#a0a8b8] hover:text-white hover:bg-[#1e2235]">
                  Login
                </LinkButton>
                <LinkButton href="/login" className="bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]">
                  Start Diagnosis
                </LinkButton>
              </div>
              <button
                type="button"
                className="md:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </>
          )}
        </div>

        {variant === "marketing" && open && (
          <div className="border-t border-[#252840] bg-[#12141f] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#a0a8b8] transition-colors hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <LinkButton href="/login" className="bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]">
                Start Diagnosis
              </LinkButton>
            </div>
          </div>
        )}
      </motion.header>

      {/* ── Floating pill (on scroll) ── */}
      {variant === "marketing" && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={
            scrolled
              ? { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" }
              : { opacity: 0, y: -20, scale: 0.95, pointerEvents: "none" }
          }
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-x-0 top-3 flex justify-center px-4"
        >
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-900 px-2 py-1.5 shadow-xl shadow-black/20 backdrop-blur-md">
            {/* Logo — icon portion only in circle */}
            <Link href="/" className="mr-2 flex items-center transition">
              <div className="h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src="/OralSense AI Logo.png"
                  alt="OralSense AI"
                  width={80}
                  height={32}
                  className="h-full w-auto max-w-none object-cover object-left"
                />
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden items-center md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/10 hover:text-white",
                    pathname === link.href && "text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <Link
              href="/login"
              className="ml-1 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-100 hover:shadow-md"
            >
              Start Diagnosis
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
