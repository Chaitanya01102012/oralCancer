"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
  clearPendingDiagnostic,
  getPendingDiagnostic,
} from "@/lib/pending-diagnostic";
import { createDiagnostic } from "@/services/diagnostics";

const STATUS_MESSAGES = [
  "Preparing patient record...",
  "Uploading oral image...",
  "Running AI inference engine...",
  "Generating diagnostic insights...",
  "Saving report to secure storage...",
];

export default function ProcessingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const started = useRef(false);
  const [progress, setProgress] = useState(8);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const blockNav = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", blockNav);
    return () => window.removeEventListener("beforeunload", blockNav);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + 4, 90));
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      const { file, payload } = getPendingDiagnostic();
      if (!file || !payload) {
        toast.error("No pending diagnostic found");
        router.replace("/diagnostic/new");
        return;
      }

      try {
        const diagnostic = await createDiagnostic(file, payload.notes || undefined, payload.patient);
        clearPendingDiagnostic();
        setProgress(100);
        queryClient.setQueryData(["diagnostic", diagnostic.id], diagnostic);
        await queryClient.invalidateQueries({ queryKey: ["diagnostics"] });
        await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success("Analysis complete");
        router.replace(`/diagnostic/report/${diagnostic.id}`);
      } catch (err) {
        clearPendingDiagnostic();
        const detail =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail || "AI analysis failed";
        toast.error(typeof detail === "string" ? detail : "AI analysis failed");
        router.replace("/diagnostic/new");
      }
    })();
  }, [queryClient, router]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        className="h-16 w-16 rounded-full border-4 border-[#6dbf8f]/15 border-t-[#6dbf8f]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <h1 className="mt-8 text-2xl font-semibold text-white">AI Processing</h1>
      <p className="mt-2 max-w-md text-[#a0a8b8]">{STATUS_MESSAGES[statusIndex]}</p>
      <div className="mt-8 w-full max-w-md space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-[#7a8299]">{progress}% complete</p>
      </div>
      <p className="mt-6 text-xs text-[#7a8299]">
        Please keep this window open. Navigation is disabled while analysis is running.
      </p>
    </div>
  );
}
