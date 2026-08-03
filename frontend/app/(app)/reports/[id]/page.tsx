"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportCard } from "@/features/diagnostics/report-card";
import { getDiagnostic } from "@/services/diagnostics";
import { getProfile } from "@/services/profile";
import { downloadReport } from "@/services/reports";

export default function ReportDetailsPage({
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

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader label="Loading report details..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="rounded-xl bg-[#e05555]/10 px-4 py-3 text-sm text-[#e05555]">
        Unable to load report details.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Diagnostic report</h1>
          <p className="mt-1 max-w-2xl text-[#a0a8b8]">
            AI screening results and probability distribution for this oral image.
          </p>
        </div>
        <Button
          className="bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]"
          onClick={async () => {
            try {
              await downloadReport(data.id);
              toast.success("Report download started");
            } catch {
              toast.error("Failed to download report");
            }
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border-[#252840] bg-[#1a1d2e] shadow-sm">
          <CardHeader>
            <CardTitle className="text-white">Patient details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-3xl border border-[#252840] bg-[#12141f] p-5 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6dbf8f]/20 text-lg font-semibold text-[#6dbf8f]">{profile?.full_name?.split(" ").map((part) => part[0]).join("")}</div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#6dbf8f]">Patient</p>
                  <p className="text-xl font-semibold">{profile?.full_name || "Unknown"}</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-[#c8d0e0]">
                <div>
                  <p className="text-[#7a8299]">Age</p>
                  <p>{profile?.age ?? "—"} years</p>
                </div>
                <div>
                  <p className="text-[#7a8299]">Gender</p>
                  <p>{profile?.gender || "—"}</p>
                </div>
                <div>
                  <p className="text-[#7a8299]">Phone</p>
                  <p>{profile?.phone_number || "—"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <ReportCard diagnostic={data} showActions={false} />
      </div>
    </div>
  );
}
