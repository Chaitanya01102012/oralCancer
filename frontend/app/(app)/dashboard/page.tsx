"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/link-button";
import { Loader } from "@/components/loader";
import { RecentDiagnosticsCard } from "@/features/dashboard/recent-diagnostics-card";
import { StatisticsCard } from "@/features/dashboard/statistics-card";
import { UserProfileCard } from "@/features/dashboard/user-profile-card";
import { getDashboardSummary } from "@/services/dashboard";
import { listDiagnostics } from "@/services/diagnostics";
import { getProfile } from "@/services/profile";

export default function DashboardPage() {
  const diagnosticsQuery = useQuery({
    queryKey: ["diagnostics"],
    queryFn: listDiagnostics,
  });
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const summaryQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardSummary,
  });

  if (diagnosticsQuery.isLoading || profileQuery.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader label="Loading dashboard..." />
      </div>
    );
  }

  const diagnostics = diagnosticsQuery.data || [];
  const summary = summaryQuery.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-[#a0a8b8]">
            Review recent diagnostics and launch a new screening.
          </p>
        </div>
        <LinkButton href="/diagnostic/new" className="bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]">
          Launch New Diagnostic
        </LinkButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <RecentDiagnosticsCard items={diagnostics} />
        <div className="space-y-6">
          {/* <UserProfileCard profile={profileQuery.data} /> */}
          <StatisticsCard
            total={summary?.total_diagnostics ?? diagnostics.length}
            lastDate={diagnostics[0]?.created_at}
          />
        </div>
      </div>
    </motion.div>
  );
}
