"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { ProbabilityChart } from "@/features/diagnostics/probability-chart";
import {
  formatConfidencePercent,
  REPORT_DISCLAIMER,
  resolveImageUrl,
  severityVariant,
} from "@/lib/utils-app";
import { downloadReport } from "@/services/reports";
import type { Diagnostic } from "@/types";

export function ReportCard({
  diagnostic,
  showActions = true,
}: {
  diagnostic: Diagnostic;
  showActions?: boolean;
}) {
  const imageUrl = resolveImageUrl(diagnostic.image_path);
  const info = diagnostic.disease_information || {};

  async function handleDownload() {
    try {
      await downloadReport(diagnostic.id);
      toast.success("Report download started");
    } catch {
      toast.error("Failed to download report");
    }
  }

  return (
    <div className="space-y-6">
      {showActions && (
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownload} className="bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]">
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
          <LinkButton href="/diagnostic/new" variant="outline" className="border-[#252840] text-[#a0a8b8] hover:bg-[#1e2235] hover:text-white">
            Launch New Diagnostic
          </LinkButton>
          <LinkButton href="/dashboard" variant="ghost" className="text-[#a0a8b8] hover:text-white hover:bg-[#1e2235]">
            Return Dashboard
          </LinkButton>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[#252840] bg-[#1a1d2e] shadow-sm">
          <CardHeader>
            <CardTitle className="text-white">Uploaded Oral Image</CardTitle>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Uploaded oral lesion"
                className="max-h-96 w-full rounded-xl object-contain bg-[#12141f]"
              />
            ) : (
              <p className="text-sm text-[#7a8299]">Image unavailable.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#252840] bg-[#1a1d2e] shadow-sm">
          <CardHeader>
            <CardTitle className="text-white">Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-[#7a8299]">Diagnosis</p>
              <p className="text-2xl font-semibold text-white">{diagnostic.prediction}</p>
            </div>
            <div>
              <p className="text-sm text-[#7a8299]">Description</p>
              <p className="text-[#c8d0e0]">{info.description || "No description available."}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div>
                <p className="mb-1 text-sm text-[#7a8299]">Severity</p>
                <Badge variant={severityVariant(info.severity)}>{info.severity || "N/A"}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#7a8299]">Recommendation</p>
              <p className="text-[#c8d0e0]">{info.recommendation || "Consult a clinician."}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
        {REPORT_DISCLAIMER}
      </p>
    </div>
  );
}
