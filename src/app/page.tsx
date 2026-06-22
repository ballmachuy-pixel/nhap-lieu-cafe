import { EntryForm } from "@/components/entry-form";
import { DailySummaryCard } from "@/components/daily-summary-card";
import { HomeHeader } from "@/components/home-header";
import { getSession } from "@/actions/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex-1 p-4 sm:p-8 bg-surface-base">
      <div className="max-w-md mx-auto space-y-6">
        <HomeHeader />
        
        <DailySummaryCard />

        <EntryForm sessionName={session.name || "Không xác định"} />
      </div>
    </main>
  );
}
