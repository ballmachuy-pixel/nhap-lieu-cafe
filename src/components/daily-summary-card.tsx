import { getDailySummary } from "@/actions/entries";
import { formatCurrency, getTodayStr } from "@/lib/utils";

export async function DailySummaryCard() {
  const today = getTodayStr();
  const summary = await getDailySummary(today);

  return (
    <div className="bg-gradient-to-br from-primary-800 to-primary-600 rounded-2xl p-6 text-white shadow-md">
      <div className="flex items-center justify-between mb-4">
        <span className="text-primary-100 font-medium text-sm tracking-wide">
          TỔNG CHI HÔM NAY
        </span>
        <span className="text-primary-200 text-xs bg-primary-900/30 px-2 py-1 rounded">
          {new Date().toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </span>
      </div>
      
      <div className="mb-6">
        <span className="text-4xl font-bold tracking-tight">
          {formatCurrency(summary.total)}
        </span>
      </div>

      <div className="flex gap-4 border-t border-primary-500/30 pt-4">
        <div className="flex-1">
          <p className="text-primary-200 text-xs mb-1">Tiền mặt</p>
          <p className="font-semibold text-sm">
            {formatCurrency(summary.cash)}
          </p>
        </div>
        <div className="w-px bg-primary-500/30"></div>
        <div className="flex-1">
          <p className="text-primary-200 text-xs mb-1">Chuyển khoản</p>
          <p className="font-semibold text-sm">
            {formatCurrency(summary.transfer)}
          </p>
        </div>
      </div>
    </div>
  );
}
