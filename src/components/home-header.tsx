"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function HomeHeader() {
  const [identity, setIdentity] = useState<string | null>(null);

  useEffect(() => {
    setIdentity(localStorage.getItem("honor_identity"));
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-ink-primary">Ghi chép chi tiêu</h1>
        <Link
          href="/history"
          className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 hover:bg-primary-100 transition-colors"
        >
          🕒 Lịch sử
        </Link>
      </div>
      {identity && (
        <div className="text-sm px-3 py-1 rounded-full bg-surface-base text-primary-500 border border-primary-200">
          👤 {identity}
        </div>
      )}
    </div>
  );
}
