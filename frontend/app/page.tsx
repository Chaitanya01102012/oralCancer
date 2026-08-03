"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Brain,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  History,
  ImagePlus,
  LayoutDashboard,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LinkButton } from "@/components/link-button";
import { TransformSection } from "@/components/transform-section";

/* ─── Animation variants ─────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55 },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { delay: i * 0.08, duration: 0.45 },
});

/* ─── Data ───────────────────────────────────────────────── */
const comparisonRows = [
  { feature: "Result Speed",   traditional: "24–72 hrs (lab turnaround)",      oralcare: "Instant AI inference" },
  { feature: "Consistency",    traditional: "Varies by clinician experience",   oralcare: "Standardised AI scoring every time" },
  { feature: "Documentation",  traditional: "Manual, prone to error",           oralcare: "Auto-generated structured PDF report" },
  { feature: "Accessibility",  traditional: "Requires on-site specialist",      oralcare: "Available anywhere, anytime" },
  { feature: "Cost",           traditional: "High — lab fees + specialist",     oralcare: "Low-cost software subscription" },
  { feature: "Audit Trail",    traditional: "Paper-based or fragmented",        oralcare: "Searchable digital history per user" },
];

const features = [
  { icon: Lock,            title: "Secure Authentication",  text: "JWT-based access with refresh token handling keeps patient data protected." },
  { icon: History,         title: "Diagnostic History",     text: "Full searchable records and a real-time dashboard view of all past screenings." },
  { icon: FileText,        title: "PDF Report Delivery",    text: "Downloadable professional-grade reports generated instantly after analysis." },
  { icon: Brain,           title: "AI-Powered Analysis",    text: "6-class oral lesion classification with calibrated probability distributions." },
  { icon: ImagePlus,       title: "Image Upload",           text: "Drag & drop oral imagery with instant pre-processing and quality checks." },
  { icon: Zap,             title: "Severity Guidance",      text: "Structured severity scoring helps clinicians prioritise follow-up care." },
  { icon: Users,           title: "Multi-User Support",     text: "Role-based access control built for clinic teams of any size." },
  { icon: LayoutDashboard, title: "Analytics Dashboard",    text: "Track screening trends over time to spot patterns and improve outcomes." },
];

const steps = [
  { icon: ClipboardList, title: "Patient Info",      text: "Capture clinical context and patient details before scanning." },
  { icon: Activity,      title: "Upload Image",      text: "Drag & drop high-resolution oral imagery into the platform." },
  { icon: Sparkles,      title: "AI Analysis",       text: "Our model runs secure inference across 6 lesion classes in seconds." },
  { icon: CheckCircle2,  title: "Download Report",   text: "Review structured insights and export a clinician-ready PDF report." },
];

const faqs = [
  {
    q: "Is this a final medical diagnosis?",
    a: "No. OralCare AI provides AI-assisted screening support only. All results must be reviewed and confirmed by a qualified clinician before any clinical decision is made.",
  },
  {
    q: "Who can access my diagnostics?",
    a: "Only the authenticated account that created a diagnostic can access it. All records are scoped to individual user identity.",
  },
  {
    q: "Can I download reports later?",
    a: "Yes. Each diagnostic session stores a report that can be retrieved and downloaded from the dashboard or full records page at any time.",
  },
  {
    q: "What types of oral lesions can the AI detect?",
    a: "The model classifies images into 6 categories covering common oral pathologies including potentially malignant and benign lesions, helping guide clinical triage.",
  },
  {
    q: "Is the platform secure and privacy-compliant?",
    a: "Yes. We use encrypted storage, JWT authentication, and a HIPAA-minded design approach. No patient images are used for model training without explicit consent.",
  },
];

/* ─── FAQ Item ───────────────────────────────────────────── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      {...stagger(index)}
      className="overflow-hidden rounded-2xl border border-[#252840] bg-[#1a1d2e]"
    >
      <button
        className="flex w-full items-center justify-between px-6 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium text-white">{q}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-[#7a8299] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="border-t border-[#252840] px-6 py-5 text-sm leading-relaxed text-[#a0a8b8]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#12141f]">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#252840]">
        {/* Background glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(109,191,143,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(78,168,210,0.08)_0%,_transparent_60%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-32">
          {/* Left — text */}
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6dbf8f]/30 bg-[#6dbf8f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#6dbf8f]">
              <Sparkles className="h-3 w-3" />
              OralCare AI · Early Access
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              Clinical-grade oral lesion screening,{" "}
              <span className="bg-gradient-to-r from-[#6dbf8f] to-[#4ea8d2] bg-clip-text text-transparent">
                powered by AI.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#a0a8b8]">
              Upload an oral image, receive structured diagnostic insights across 6 lesion classes, and download
              professional PDF reports — designed for modern healthcare teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton
                href="/login"
                size="lg"
                className="bg-[#6dbf8f] text-[#0d1a14] shadow-lg shadow-[#6dbf8f]/20 hover:bg-[#5aad7d]"
              >
                Start Diagnosis
              </LinkButton>
              <LinkButton
                href="/#how-it-works"
                size="lg"
                variant="outline"
                className="border-[#252840] bg-transparent text-white hover:bg-[#1a1d2e] hover:text-white"
              >
                See How It Works
              </LinkButton>
            </div>
            <p className="mt-6 text-xs text-[#7a8299]">
              For screening assistance only. All results require clinician review.
            </p>
          </motion.div>

          {/* Right — visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative min-h-80 rounded-3xl border border-[#6dbf8f]/20 bg-gradient-to-br from-[#1e2e25] via-[#1a2a28] to-[#1a1d2e] p-8 text-white shadow-2xl shadow-black/40"
          >
            <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-[#6dbf8f]/10 blur-2xl" />
            <div className="absolute bottom-8 left-8 h-16 w-16 rounded-full bg-[#4ea8d2]/10 blur-xl" />

            <ShieldCheck className="relative mb-5 h-10 w-10 text-[#6dbf8f] opacity-90" />
            <p className="relative text-2xl font-bold leading-snug text-white">Trusted screening assistance for every clinic</p>
            <p className="relative mt-3 max-w-sm text-[#a0a8b8]">
              Probability distributions, severity guidance, and PDF reports — ready for clinical review workflows.
            </p>

            <div className="relative mt-10 grid grid-cols-3 gap-3 text-center">
              {[
                ["6", "Lesion classes"],
                ["PDF", "Auto-reports"],
                ["HIPAA-", "minded UX"],
              ].map(([a, b]) => (
                <div key={a} className="rounded-2xl border border-[#6dbf8f]/15 bg-[#6dbf8f]/10 px-3 py-4 backdrop-blur-sm">
                  <p className="text-lg font-bold text-[#6dbf8f]">{a}</p>
                  <p className="text-xs text-[#7a8299]">{b}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Transform Section ──────────────────────────────── */}
      <TransformSection />

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-[#252840] bg-[#1a1d2e] py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6dbf8f]">The Workflow</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-[#a0a8b8]">
              A focused four-step journey from patient intake to downloadable clinical report.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                {...stagger(i)}
                className="group relative rounded-2xl border border-[#252840] bg-[#12141f] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6dbf8f]/40 hover:shadow-[0_8px_30px_rgba(109,191,143,0.08)]"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#6dbf8f]/10 transition-colors group-hover:bg-[#6dbf8f]/20">
                  <Icon className="h-6 w-6 text-[#6dbf8f]" />
                </div>
                <span className="absolute right-5 top-5 text-4xl font-black text-white/5 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7a8299]">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ─────────────────────────────────── */}
      <section id="comparison" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6dbf8f]">Why OralCare AI</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Traditional screening wasn&apos;t built for speed.
            </h2>
            <p className="mt-4 text-lg text-[#a0a8b8]">
              Modern clinics deserve modern tools. See how OralCare AI compares to the traditional screening workflow.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mt-12 overflow-hidden rounded-3xl border border-[#252840]">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-[#252840]">
              <div className="bg-[#1a1d2e] px-6 py-5 text-sm font-semibold text-[#7a8299]">Feature</div>
              <div className="border-x border-[#252840] bg-[#1a1d2e] px-6 py-5 text-sm font-semibold text-[#a0a8b8]">Traditional Screening</div>
              <div className="bg-[#1e2e25] px-6 py-5 text-sm font-bold text-[#6dbf8f]">OralCare AI</div>
            </div>

            {/* Rows */}
            {comparisonRows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 border-b border-[#252840] last:border-0 ${
                  i % 2 === 0 ? "bg-[#12141f]" : "bg-[#1a1d2e]/50"
                }`}
              >
                <div className="px-6 py-4 text-sm font-medium text-[#c8d0e0]">{row.feature}</div>
                <div className="flex items-center gap-2 border-x border-[#252840] px-6 py-4 text-sm text-[#7a8299]">
                  <X className="h-4 w-4 flex-shrink-0 text-[#e05555]" />
                  {row.traditional}
                </div>
                <div className="flex items-center gap-2 bg-[#6dbf8f]/5 px-6 py-4 text-sm font-medium text-[#c8d0e0]">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#6dbf8f]" />
                  {row.oralcare}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────────── */}
      <section id="features" className="border-y border-[#252840] bg-[#1a1d2e] py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6dbf8f]">Platform Features</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                A complete oral cancer screening platform.
              </h2>
              <p className="mt-4 text-lg text-[#a0a8b8]">
                Built for clarity, speed, and clinical trust — everything your team needs, nothing it doesn&apos;t.
              </p>
            </div>
            <LinkButton
              href="/login"
              className="shrink-0 bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]"
            >
              Start Diagnosis
            </LinkButton>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                {...stagger(i)}
                className="group rounded-2xl border border-[#252840] bg-[#12141f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#6dbf8f]/40 hover:shadow-[0_8px_30px_rgba(109,191,143,0.08)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#6dbf8f]/10 transition-colors group-hover:bg-[#6dbf8f]/20">
                  <Icon className="h-5 w-5 text-[#6dbf8f]" />
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7a8299]">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission / CTA Split ──────────────────────────────── */}
      <section id="mission" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-[#252840] lg:grid lg:grid-cols-2">
            {/* Left — dark visual */}
            <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#0d1a14] via-[#0f1e18] to-[#12141f] p-10 text-white">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#6dbf8f]/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#4ea8d2]/10 blur-3xl" />

              <div className="relative">
                <ShieldCheck className="h-10 w-10 text-[#6dbf8f]" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#6dbf8f]">
                  Built for healthcare
                </p>
                <h3 className="mt-3 text-2xl font-bold leading-snug text-white">
                  Technology you can trust. Results you can act on.
                </h3>
                <p className="mt-4 leading-relaxed text-[#a0a8b8]">
                  OralCare AI combines deep learning with a clinician-focused design — so your team spends less time on
                  documentation and more time on patient care.
                </p>
              </div>

              <div className="relative mt-10 grid grid-cols-3 gap-4">
                {[
                  { stat: "6",    label: "Lesion classes" },
                  { stat: "<2s",  label: "Inference time" },
                  { stat: "PDF",  label: "Auto-reports" },
                ].map(({ stat, label }) => (
                  <div key={label} className="rounded-2xl border border-[#6dbf8f]/15 bg-[#6dbf8f]/10 p-4 text-center">
                    <p className="text-xl font-bold text-[#6dbf8f]">{stat}</p>
                    <p className="mt-1 text-xs text-[#7a8299]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — text + CTA */}
            <div className="flex flex-col justify-center bg-[#1a1d2e] p-10 lg:p-14">
              <motion.div {...fadeUp}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6dbf8f]">Our Mission</p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  A movement to improve early detection worldwide.
                </h2>
                <p className="mt-5 leading-relaxed text-[#a0a8b8]">
                  OralCare AI is more than a screening tool. We&apos;re partners in your clinical journey — helping
                  healthcare teams detect oral cancer earlier, document more consistently, and ultimately save lives
                  through technology.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "AI screening assistance in seconds, not days",
                    "Professional PDF reports ready for clinical review",
                    "Secure, privacy-first infrastructure for patient data",
                    "Continuously improved models for better accuracy",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#c8d0e0]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#6dbf8f]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <LinkButton
                    href="/login"
                    className="bg-[#6dbf8f] text-[#0d1a14] shadow-lg shadow-[#6dbf8f]/20 hover:bg-[#5aad7d]"
                  >
                    Get Started Free
                  </LinkButton>
                  <LinkButton
                    href="/#faq"
                    variant="outline"
                    className="border-[#252840] bg-transparent text-white hover:bg-[#252840] hover:text-white"
                  >
                    Read FAQ
                  </LinkButton>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="border-t border-[#252840] bg-[#1a1d2e] py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6dbf8f]">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-[#a0a8b8]">Everything you need to know before getting started.</p>
          </motion.div>

          <div className="mt-12 space-y-3">
            {faqs.map((item, i) => (
              <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section id="contact" className="border-t border-[#252840] py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6dbf8f]">Get in Touch</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Ready to modernise your screening workflow?
            </h2>
            <p className="mt-4 max-w-xl text-lg text-[#a0a8b8]">
              Have questions about OralCare AI or want to get your team onboarded? Reach out — we&apos;re here to help.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <LinkButton
                href="/login"
                size="lg"
                className="bg-[#6dbf8f] text-[#0d1a14] shadow-lg shadow-[#6dbf8f]/20 hover:bg-[#5aad7d]"
              >
                Start Diagnosis
              </LinkButton>
              <a
                href="mailto:support@oralcare-ai.local"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-[#a0a8b8] transition hover:text-[#6dbf8f]"
              >
                <Mail className="h-4 w-4" />
                Chaitanyaupadhyay12@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
