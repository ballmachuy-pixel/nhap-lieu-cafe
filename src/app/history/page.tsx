import { getRecentEntries } from "@/actions/entries";
import Link from "next/link";
import { FilterBar } from "./filter-bar";
import { HistoryList } from "./history-list";

export const dynamic = "force-dynamic";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const filterDate = typeof resolvedParams.date === "string" ? resolvedParams.date : undefined;

  const entries = await getRecentEntries(filterDate);

  return (
    <main className="flex-1 p-4 sm:p-8 bg-surface-base">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
          >
            ←
          </Link>
          <h1 className="text-2xl font-bold text-ink-primary">Lịch sử Nhập</h1>
        </div>

        <FilterBar />

        <HistoryList entries={entries} />
      </div>
    </main>
  );
}
