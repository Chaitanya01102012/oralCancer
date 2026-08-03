import { AuthGuard } from "@/components/auth-guard";
import { AppNavbar } from "@/components/app-navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#12141f]">
        <AppNavbar />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
