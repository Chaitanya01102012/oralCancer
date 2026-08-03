"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Loader({
  label = "Processing...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-[#6dbf8f]/15 border-t-[#6dbf8f]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-sm text-[#a0a8b8]">{label}</p>
    </div>
  );
}
