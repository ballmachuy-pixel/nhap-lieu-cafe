"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = searchParams.get("date") || "";

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      router.push(`/history?date=${newDate}`);
    } else {
      router.push("/history");
    }
  };

  const clearFilter = () => {
    router.push("/history");
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <input
        type="date"
        value={currentDate}
        onChange={handleDateChange}
        className="flex-1 h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
      />
      {currentDate && (
        <button
          onClick={clearFilter}
          className="h-12 px-4 bg-primary-100 text-primary-700 font-medium rounded-xl hover:bg-primary-200 transition-colors"
        >
          Xóa
        </button>
      )}
    </div>
  );
}
