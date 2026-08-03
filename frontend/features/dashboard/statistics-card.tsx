import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatisticsCard({
  total,
  lastDate,
}: {
  total: number;
  lastDate?: string | null;
}) {
  return (
    <Card className="border-[#252840] bg-[#1a1d2e] shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-white">Quick Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#6dbf8f]/10 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6dbf8f]">
            Total Diagnostics
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">{total}</p>
        </div>
        <div className="rounded-xl bg-[#1e2235] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#7a8299]">
            Last Diagnostic
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            {lastDate ? new Date(lastDate).toLocaleDateString() : "—"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
