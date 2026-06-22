import { DashboardClient } from "@/components/dashboard-client";
import { HomeHeader } from "@/components/home-header";

export default function DashboardPage() {
  return (
    <main className="flex-1 p-4 sm:p-8 bg-surface-base">
      <div className="max-w-md mx-auto space-y-6">
        <HomeHeader />
        
        <div className="pt-4">
          <h2 className="text-xl font-bold text-ink-primary mb-4">Báo cáo tổng hợp</h2>
          <DashboardClient />
        </div>
      </div>
    </main>
  );
}
