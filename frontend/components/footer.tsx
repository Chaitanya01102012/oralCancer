import Link from "next/link";
import Image from "next/image";
import { Mail, ShieldCheck } from "lucide-react";

const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/#comparison", label: "Why OralCare AI" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#252840] bg-[#1a1d2e]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand column */}
          <div>
            <Image
              src="/OralSense AI Logo.png"
              alt="OralSense AI"
              width={120}
              height={36}
              className="h-9 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#7a8299]">
              AI-assisted oral cancer screening designed for modern clinical workflows. For screening assistance only — all results require clinician review.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-[#7a8299]">
              <ShieldCheck className="h-4 w-4 text-[#6dbf8f]" />
              HIPAA-minded design
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7a8299]">Platform</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#a0a8b8] transition-colors hover:text-[#6dbf8f]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7a8299]">Contact</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="mailto:support@oralcare-ai.local"
                  className="inline-flex items-center gap-2 text-sm text-[#a0a8b8] transition-colors hover:text-[#6dbf8f]"
                >
                  <Mail className="h-4 w-4" />
                  support@oralcare-ai.local
                </a>
              </li>
              <li>
                <Link href="/login" className="text-sm text-[#a0a8b8] transition-colors hover:text-[#6dbf8f]">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-[#a0a8b8] transition-colors hover:text-[#6dbf8f]">
                  Start Diagnosis
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#252840] pt-6 sm:flex-row">
          <p className="text-xs text-[#7a8299]">
            © {new Date().getFullYear()} OralCare AI. All rights reserved. For screening assistance only.
          </p>
          <p className="text-xs text-[#7a8299]">
            AI outputs are not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
