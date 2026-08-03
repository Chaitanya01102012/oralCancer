"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Download, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/link-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatConfidencePercent } from "@/lib/utils-app";
import { deleteDiagnostic } from "@/services/diagnostics";
import { downloadReport } from "@/services/reports";
import type { Diagnostic } from "@/types";

export function DiagnosticHistoryTable({ items }: { items: Diagnostic[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteDiagnostic,
    onSuccess: () => {
      toast.success("Diagnostic deleted");
      queryClient.invalidateQueries({ queryKey: ["diagnostics"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Failed to delete diagnostic"),
  });

  const predictions = useMemo(
    () => Array.from(new Set(items.map((i) => i.prediction))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    let list = [...items];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.prediction.toLowerCase().includes(q) ||
          (i.notes || "").toLowerCase().includes(q),
      );
    }
    if (filter !== "all") {
      list = list.filter((i) => i.prediction === filter);
    }
    list.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sort === "desc" ? db - da : da - db;
    });
    return list;
  }, [items, search, filter, sort]);

  async function handleDownload(id: number) {
    try {
      await downloadReport(id);
      toast.success("Report download started");
    } catch {
      toast.error("Failed to download report");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          placeholder="Search prediction or notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={filter} onValueChange={(v) => setFilter(String(v ?? "all"))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter prediction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All predictions</SelectItem>
            {predictions.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(v) => setSort((v as "asc" | "desc") || "desc")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#252840] bg-[#1a1d2e] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#1e2235] text-[#a0a8b8]">
              <tr>
                <th className="px-4 py-3 font-medium">Prediction</th>
                <th className="px-4 py-3 font-medium">Confidence</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-[#7a8299]">
                    No records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-t border-[#252840]">
                    <td className="px-4 py-3 font-medium text-white">{item.prediction}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{formatConfidencePercent(item.confidence)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-[#a0a8b8]">
                      {format(new Date(item.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <LinkButton href={`/reports/${item.id}`} size="sm" variant="outline" className="border-[#252840] text-[#a0a8b8] hover:bg-[#1e2235] hover:text-white">
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </LinkButton>
                        <Button size="sm" variant="outline" onClick={() => handleDownload(item.id)} className="border-[#252840] text-[#a0a8b8] hover:bg-[#1e2235] hover:text-white">
                          <Download className="mr-1 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#252840] text-[#e05555] hover:bg-[#e05555]/10 hover:text-[#e05555]"
                          onClick={() => {
                            if (confirm("Delete this diagnostic and its report?")) {
                              deleteMutation.mutate(item.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
