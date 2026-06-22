import Link from "next/link";
import { getSession } from "@/actions/auth";
import { LogoutButton } from "./logout-button";

export async function HomeHeader() {
  const session = await getSession();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-primary">Ghi chép chi tiêu</h1>
        {session.name && (
          <div className="flex items-center">
            <div className="text-sm px-3 py-1 rounded-full bg-surface-base text-primary-500 border border-primary-200">
              👤 {session.name}
            </div>
            <LogoutButton />
          </div>
        )}
      </div>
      
      {/* Menu Navigation */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="text-sm font-medium text-ink-primary bg-surface-base px-3 py-1 rounded-full border border-primary-200 hover:bg-primary-50 transition-colors"
        >
          📝 Nhập liệu
        </Link>
        <Link
          href="/history"
          className="text-sm font-medium text-ink-primary bg-surface-base px-3 py-1 rounded-full border border-primary-200 hover:bg-primary-50 transition-colors"
        >
          🕒 Lịch sử
        </Link>
        {session.role === "admin" && (
          <Link
            href="/dashboard"
            className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-300 shadow-sm transition-colors"
          >
            📊 Báo cáo
          </Link>
        )}
      </div>
    </div>
  );
}
