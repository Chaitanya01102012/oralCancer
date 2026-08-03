"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toPercent } from "@/lib/utils-app";

export function ProbabilityChart({
  probabilities,
}: {
  probabilities?: Record<string, number> | null;
}) {
  const data = Object.entries(probabilities || {}).map(([name, value]) => ({
    name,
    value: Math.round(toPercent(value) * 100) / 100,
  }));

  if (data.length === 0) {
    return (
      <p className="rounded-xl bg-[#1e2235] px-4 py-8 text-center text-sm text-[#7a8299]">
        Probability distribution unavailable.
      </p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#252840" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#a0a8b8" }} interval={0} angle={-20} textAnchor="end" height={50} />
          <YAxis unit="%" tick={{ fontSize: 12, fill: "#a0a8b8" }} />
          <Tooltip
            formatter={(value) => [`${value}%`, "Probability"]}
            contentStyle={{ backgroundColor: "#1a1d2e", border: "1px solid #252840", borderRadius: "8px", color: "#f0f2f8" }}
          />
          <Bar dataKey="value" fill="#6dbf8f" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
