"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/loader";
import { ReportCard } from "@/features/diagnostics/report-card";
import { getDiagnostic } from "@/services/diagnostics";

export default function DiagnosticReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const diagnosticId = Number(id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["diagnostic", diagnosticId],
    queryFn: () => getDiagnostic(diagnosticId),
    enabled: Number.isFinite(diagnosticId),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader label="Loading report..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="rounded-xl bg-[#e05555]/10 px-4 py-3 text-sm text-[#e05555]">
        Unable to load diagnostic report.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Diagnostic Report</h1>
        <p className="mt-1 text-[#a0a8b8]">AI screening results for this oral image.</p>
      </div>
      <ReportCard diagnostic={data} />
    </div>
  );
}
