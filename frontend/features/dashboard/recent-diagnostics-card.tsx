"use client";

import { format } from "date-fns";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { formatConfidencePercent } from "@/lib/utils-app";
import { downloadReport } from "@/services/reports";
import type { Diagnostic } from "@/types";

export function RecentDiagnosticsCard({ items }: { items: Diagnostic[] }) {
  const recent = items.slice(0, 3);

  async function handleDownload(id: number) {
    try {
      await downloadReport(id);
      toast.success("Report download started");
    } catch {
      toast.error("Failed to download report");
    }
  }

  return (
    <Card className="border-[#252840] bg-[#1a1d2e] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-white">Recent Diagnostics</CardTitle>
        <LinkButton href="/records" variant="outline" size="sm" className="border-[#252840] text-[#a0a8b8] hover:bg-[#1e2235] hover:text-white">
          View All Records
        </LinkButton>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.length === 0 ? (
          <p className="rounded-xl bg-[#1e2235] px-4 py-8 text-center text-sm text-[#7a8299]">
            No diagnostics yet. Launch a new diagnostic to get started.
          </p>
        ) : (
          recent.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-[#252840] bg-[#12141f] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{item.prediction}</p>
                </div>
                <p className="mt-1 text-sm text-[#7a8299]">
                  {format(new Date(item.created_at), "MMM d, yyyy · h:mm a")}
                </p>
              </div>
              <div className="flex gap-2">
                <LinkButton href={`/diagnostic/report/${item.id}`} variant="outline" size="sm" className="border-[#252840] text-[#a0a8b8] hover:bg-[#1e2235] hover:text-white">
                  <Eye className="mr-1 h-4 w-4" />
                  View Report
                </LinkButton>
                <Button variant="outline" size="sm" onClick={() => handleDownload(item.id)} className="border-[#252840] text-[#a0a8b8] hover:bg-[#1e2235] hover:text-white">
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          ))
        )}
        <LinkButton href="/diagnostic/new" className="mt-2 w-full bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]">
          Launch New Diagnostic
        </LinkButton>
      </CardContent>
    </Card>
  );
}
