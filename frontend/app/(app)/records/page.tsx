"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/loader";
import { DiagnosticHistoryTable } from "@/features/diagnostics/history-table";
import { listDiagnostics } from "@/services/diagnostics";

export default function RecordsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["diagnostics"],
    queryFn: listDiagnostics,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">View All Records</h1>
        <p className="mt-1 text-[#a0a8b8]">Complete diagnostic history for your account.</p>
      </div>

      {isLoading && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader label="Loading records..." />
        </div>
      )}
      {error && (
        <p className="rounded-xl bg-[#e05555]/10 px-4 py-3 text-sm text-[#e05555]">
          Failed to load diagnostics.
        </p>
      )}
      {data && <DiagnosticHistoryTable items={data} />}
    </div>
  );
}
