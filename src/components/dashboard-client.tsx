"use client";

import { useState, useEffect } from "react";
import { getDashboardData } from "@/actions/dashboard";
import { formatDateStr, getTodayStr } from "@/lib/utils";
import * as XLSX from "xlsx";
import { toast } from "sonner";

type EntryRow = {
  id: string;
  date: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  supplier: string | null;
  amount: number;
  method: "CASH" | "TRANSFER";
  note: string | null;
  created_by: string;
};

export function DashboardClient() {
  const [filterMode, setFilterMode] = useState<"today" | "month" | "custom">("today");
  const [customStart, setCustomStart] = useState<string>(getTodayStr());
  const [customEnd, setCustomEnd] = useState<string>(getTodayStr());
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    let startDateStr = "";
    let endDateStr = "";

    if (filterMode === "custom") {
      startDateStr = customStart;
      endDateStr = customEnd;
      
      // Validation: 31 days max
      const s = new Date(startDateStr);
      const e = new Date(endDateStr);
      const diffTime = Math.abs(e.getTime() - s.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 31) {
        toast.error("Chỉ được truy xuất tối đa 31 ngày để đảm bảo hiệu năng!");
        setIsLoading(false);
        return;
      }
      if (e < s) {
        toast.error("Ngày kết thúc không được nhỏ hơn ngày bắt đầu!");
        setIsLoading(false);
        return;
      }
    } else {
      const now = new Date();
      if (filterMode === "today") {
        startDateStr = formatDateStr(now);
        endDateStr = formatDateStr(now);
      } else if (filterMode === "month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        startDateStr = formatDateStr(start);
        endDateStr = formatDateStr(end);
      }
    }

    const res = await getDashboardData(startDateStr, endDateStr);
    if (res.success && res.entries) {
      setEntries(res.entries);
    } else {
      toast.error("Lỗi khi tải dữ liệu");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Only auto-fetch when mode changes. If custom, we only fetch when user clicks "Áp dụng"
    if (filterMode !== "custom") {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMode]);

  const handleCustomApply = () => {
    fetchStats();
  };

  const total = entries.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCash = entries.filter(e => e.method === "CASH").reduce((acc, curr) => acc + curr.amount, 0);
  const totalTransfer = entries.filter(e => e.method === "TRANSFER").reduce((acc, curr) => acc + curr.amount, 0);

  const handleExport = () => {
    if (entries.length === 0) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }

    const data = entries.map((e) => ({
      "Ngày": new Date(e.date).toLocaleDateString("vi-VN"),
      "Tên hàng hóa": e.name,
      "Số lượng": e.quantity || "",
      "ĐVT": e.unit || "",
      "Nhà cung cấp": e.supplier || "",
      "Số tiền (VNĐ)": e.amount,
      "Thanh toán": e.method === "CASH" ? "Tiền mặt" : "Chuyển khoản",
      "Ghi chú": e.note || "",
      "Người nhập": e.created_by
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BaoCao");

    const fileName = `BaoCao_ChiTieu_${filterMode}_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="space-y-6">
      {/* Bộ lọc */}
      <div className="bg-surface-base border border-primary-200 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterMode("today")}
            className={`flex-1 py-2 rounded-xl font-medium transition-colors border ${
              filterMode === "today" ? "bg-primary-600 text-surface-base border-primary-600" : "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setFilterMode("month")}
            className={`flex-1 py-2 rounded-xl font-medium transition-colors border ${
              filterMode === "month" ? "bg-primary-600 text-surface-base border-primary-600" : "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
            }`}
          >
            Tháng này
          </button>
          <button
            onClick={() => setFilterMode("custom")}
            className={`flex-1 py-2 rounded-xl font-medium transition-colors border ${
              filterMode === "custom" ? "bg-primary-600 text-surface-base border-primary-600" : "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
            }`}
          >
            Tùy chọn
          </button>
        </div>

        {filterMode === "custom" && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-primary-100">
            <div className="space-y-1">
              <label className="text-xs font-medium text-primary-600">Từ ngày</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-primary-300 bg-surface-base text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-primary-600">Đến ngày</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-primary-300 bg-surface-base text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="col-span-2 pt-1">
              <button
                onClick={handleCustomApply}
                disabled={isLoading}
                className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Thống kê */}
      <div className="grid gap-4">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-surface-base shadow-lg">
          <div className="text-primary-100 font-medium mb-1">Tổng chi</div>
          <div className="text-4xl font-bold">
            {isLoading ? "..." : total.toLocaleString("vi-VN")} đ
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-base border border-primary-100 rounded-2xl p-4 shadow-sm">
            <div className="text-sm text-primary-600 font-medium mb-1">Tiền mặt</div>
            <div className="text-xl font-bold text-ink-primary">
              {isLoading ? "..." : totalCash.toLocaleString("vi-VN")} đ
            </div>
          </div>
          <div className="bg-surface-base border border-primary-100 rounded-2xl p-4 shadow-sm">
            <div className="text-sm text-primary-600 font-medium mb-1">Chuyển khoản</div>
            <div className="text-xl font-bold text-ink-primary">
              {isLoading ? "..." : totalTransfer.toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách thẻ (Card List) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-lg font-bold text-ink-primary">
          Chi tiết giao dịch ({entries.length})
        </h3>
        {isLoading ? (
          <div className="text-center text-primary-500 py-4 animate-pulse">Đang tải dữ liệu...</div>
        ) : entries.length === 0 ? (
          <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-xl border border-gray-100">
            Không có dữ liệu trong khoảng thời gian này
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 pb-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-surface-base border border-primary-100 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-ink-primary text-base line-clamp-2">
                    {entry.name}
                  </div>
                  <div className="font-bold text-red-600 whitespace-nowrap ml-2">
                    {entry.amount.toLocaleString("vi-VN")} đ
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="text-primary-600">
                    <span className="font-medium">{new Date(entry.date).toLocaleDateString("vi-VN")}</span>
                    {entry.quantity && (
                      <span className="ml-2 bg-primary-50 px-2 py-0.5 rounded-md text-primary-700">
                        {entry.quantity} {entry.unit}
                      </span>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs font-medium ${entry.method === "CASH" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                    {entry.method === "CASH" ? "Tiền mặt" : "Chuyển khoản"}
                  </div>
                </div>

                {entry.note && (
                  <div className="text-sm text-gray-500 italic bg-gray-50 p-2 rounded-lg mt-1">
                    "{entry.note}"
                  </div>
                )}
                
                <div className="text-xs text-gray-400 text-right mt-1">
                  Nhập bởi: {entry.created_by}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hành động */}
      <button
        onClick={handleExport}
        disabled={isLoading || entries.length === 0}
        className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 transition-all text-white font-semibold text-lg flex items-center justify-center shadow-sm gap-2 sticky bottom-4 z-10"
      >
        <span>📥</span> Xuất file Excel ({entries.length} mục)
      </button>
    </div>
  );
}
