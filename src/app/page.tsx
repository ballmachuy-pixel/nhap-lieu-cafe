import { EntryForm } from "@/components/entry-form";
import { DailySummaryCard } from "@/components/daily-summary-card";
import { HomeHeader } from "@/components/home-header";

export default function Home() {
  return (
    <main className="flex-1 p-4 sm:p-8 bg-surface-base">
      <div className="max-w-md mx-auto space-y-6">
        <HomeHeader />
        
        <DailySummaryCard />

        <EntryForm />
      </div>
    </main>
  );
}
