"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";

const pairs = [
  { problem: "Slow Results", solution: "Instant AI Inference" },
  { problem: "High Costs", solution: "Low-Cost Subscription" },
  { problem: "Manual Documentation", solution: "Auto-Generated Reports" },
  { problem: "Inconsistent Screening", solution: "Standardised AI Scoring" },
  { problem: "Limited Access", solution: "Available Anywhere" },
];

const SLOT_GAP = 46;
const SLOT_START_Y = -((pairs.length - 1) * SLOT_GAP) / 2;

export function TransformSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.3 });

  const [leftSlots, setLeftSlots] = useState<boolean[]>(pairs.map(() => false));
  const [rightSlots, setRightSlots] = useState<boolean[]>(pairs.map(() => false));
  // Tracks which right pills were just placed (skip enter animation)
  const justPlaced = useRef<Set<number>>(new Set());
  const [travelIdx, setTravelIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<"toCenter" | "fromCenter" | null>(null);
  const nextToSend = useRef(0);
  const initialized = useRef(false);

  // Step 1: Stagger-fill all 5 left slots
  useEffect(() => {
    if (!inView || initialized.current) return;
    initialized.current = true;
    pairs.forEach((_, i) => {
      setTimeout(() => {
        setLeftSlots((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 250);
    });
  }, [inView]);

  // Step 2: After all left slots filled, start sending the first one
  const allLeftFilled = leftSlots.every(Boolean) && rightSlots.every((v) => !v) && travelIdx === null;
  const kickoffDone = useRef(false);

  useEffect(() => {
    if (!allLeftFilled || kickoffDone.current) return;
    kickoffDone.current = true;
    const timer = setTimeout(() => {
      sendNext();
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLeftFilled]);

  const sendNext = useCallback(() => {
    const idx = nextToSend.current % pairs.length;
    setLeftSlots((prev) => {
      const next = [...prev];
      next[idx] = false;
      return next;
    });
    setTravelIdx(idx);
    setPhase("toCenter");
    nextToSend.current = (nextToSend.current + 1) % pairs.length;
  }, []);

  const onReachCenter = useCallback(() => {
    setPhase("fromCenter");
  }, []);

  const onReachRight = useCallback(() => {
    if (travelIdx === null) return;
    const idx = travelIdx;

    // Mark this pill as "just placed" so it skips enter animation
    justPlaced.current.add(idx);

    // Clear travel FIRST, then show right slot in the same batch
    // This removes the traveling pill and shows the static one simultaneously
    setTravelIdx(null);
    setPhase(null);
    setRightSlots((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });

    // If 3 are now on the right, fade the oldest
    const rightCount = rightSlots.filter(Boolean).length + 1;
    if (rightCount >= 3) {
      const oldestIdx = (idx - 2 + pairs.length) % pairs.length;
      setTimeout(() => {
        setRightSlots((prev) => {
          const next = [...prev];
          next[oldestIdx] = false;
          return next;
        });
      }, 400);
    }

    // Send next after a pause, then refill the old left slot
    // after the next pill has already started traveling away
    const refillIdx = (idx - 2 + pairs.length) % pairs.length;
    setTimeout(() => {
      sendNext();
      // Refill after the next pill has left its slot (sendNext removes it)
      setTimeout(() => {
        setLeftSlots((prev) => {
          const next = [...prev];
          if (!next[refillIdx]) {
            next[refillIdx] = true;
          }
          return next;
        });
      }, 400);
    }, 800);
  }, [travelIdx, rightSlots, sendNext]);

  const slotY = (i: number) => SLOT_START_Y + i * SLOT_GAP;

  return (
    <section className="border-b border-[#252840] py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-[#6dbf8f]/30 bg-[#6dbf8f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#6dbf8f]">
            The Problem
          </span>
          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Traditional screening is designed{" "}
            <br className="hidden sm:block" />
            for delays, <em className="not-italic text-[#a0a8b8]">not outcomes.</em>
          </h2>
        </motion.div>

        <div
          ref={containerRef}
          className="relative mx-auto mt-16 max-w-5xl"
          style={{ height: `${pairs.length * SLOT_GAP + 80}px` }}
        >
          {/* ── Left pills (fixed slots) ── */}
          {pairs.map((pair, i) => (
            <AnimatePresence key={`left-${i}`}>
              {leftSlots[i] && (
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.4 } }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute left-0 inline-flex items-center whitespace-nowrap rounded-full border border-[#252840] bg-[#1a1d2e] px-5 py-2 text-sm font-medium text-[#7a8299]"
                  style={{ top: `calc(50% + ${slotY(i)}px)` }}
                >
                  {pair.problem}
                </motion.span>
              )}
            </AnimatePresence>
          ))}

          {/* ── Center logo ── */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-full bg-[#6dbf8f]/8 blur-2xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#252840] bg-[#1a1d2e] shadow-2xl shadow-black/40">
                <Image
                  src="/OralSense AI Logo.png"
                  alt="OralSense AI"
                  width={80}
                  height={80}
                  className="h-16 w-auto object-contain"
                />
              </div>
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 rounded-full border border-[#6dbf8f]/20"
              />
            </motion.div>
          </div>

          {/* ── Traveling pill: problem fading into center ── */}
          <AnimatePresence>
            {travelIdx !== null && phase === "toCenter" && (
              <motion.span
                key={`toCenter-${travelIdx}`}
                initial={{
                  left: 0,
                  top: `calc(50% + ${slotY(travelIdx)}px)`,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  left: "calc(50% - 50px)",
                  top: "calc(50% - 16px)",
                  opacity: 0,
                  scale: 0.6,
                }}
                transition={{ duration: 1.1, ease: [0.45, 0.02, 0.15, 1] }}
                onAnimationComplete={onReachCenter}
                className="absolute z-30 inline-flex items-center whitespace-nowrap rounded-full border border-[#252840] bg-[#1a1d2e] px-5 py-2 text-sm font-medium text-[#7a8299]"
              >
                {pairs[travelIdx].problem}
              </motion.span>
            )}
          </AnimatePresence>

          {/* ── Pulse on absorb ── */}
          <AnimatePresence>
            {travelIdx !== null && phase === "fromCenter" && (
              <motion.div
                key={`pulse-${travelIdx}`}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-15 h-28 w-28 rounded-full border-2 border-[#6dbf8f]/40 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* ── Traveling pill: solution emerging from center to its right slot ── */}
          <AnimatePresence>
            {travelIdx !== null && phase === "fromCenter" && (
              <motion.span
                key={`fromCenter-${travelIdx}`}
                initial={{
                  right: "calc(50% - 50px)",
                  top: "calc(50% - 16px)",
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  right: 0,
                  top: `calc(50% + ${slotY(travelIdx)}px)`,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{ duration: 1.1, ease: [0.45, 0.02, 0.15, 1] }}
                onAnimationComplete={onReachRight}
                className="absolute z-30 inline-flex items-center whitespace-nowrap rounded-full bg-[#6dbf8f] px-5 py-2 text-sm font-semibold text-[#0d1a14] shadow-lg shadow-[#6dbf8f]/20"
              >
                {pairs[travelIdx].solution}
              </motion.span>
            )}
          </AnimatePresence>

          {/* ── Right pills (fixed slots) ── */}
          {pairs.map((pair, i) => (
            <AnimatePresence key={`right-${i}`}>
              {rightSlots[i] && (
                <motion.span
                  initial={
                    justPlaced.current.has(i)
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.9 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.6, ease: "easeInOut" } }}
                  transition={{ duration: 0.01 }}
                  onAnimationComplete={() => {
                    justPlaced.current.delete(i);
                  }}
                  className="absolute right-0 inline-flex items-center whitespace-nowrap rounded-full bg-[#6dbf8f] px-5 py-2 text-sm font-semibold text-[#0d1a14]"
                  style={{ top: `calc(50% + ${slotY(i)}px)` }}
                >
                  {pair.solution}
                </motion.span>
              )}
            </AnimatePresence>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-center text-sm text-[#7a8299]"
        >
          OralCare AI transforms every bottleneck into a clinical advantage.
        </motion.p>
      </div>
    </section>
  );
}
