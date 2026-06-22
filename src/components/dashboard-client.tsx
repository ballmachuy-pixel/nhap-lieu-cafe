"use client";

import { useState, useEffect } from "react";
import { getDashboardData } from "@/actions/dashboard";
import * as XLSX from "xlsx";

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
  const [filterType, setFilterType] = useState<"today" | "month" | "year">("today");
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    const now = new Date();
    // Chuyển sang giờ VN (UTC+7) để tính toán đúng ngày
    const vnTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    
    let start = new Date(vnTime);
    let end = new Date(vnTime);

    if (filterType === "today") {
      // Start and end are the same day
    } else if (filterType === "month") {
      start.setDate(1); // Đầu tháng
      end.setMonth(start.getMonth() + 1);
      end.setDate(0); // Cuối tháng
    } else if (filterType === "year") {
      start.setMonth(0, 1); // Đầu năm
      end.setMonth(11, 31); // Cuối năm
    }

    const startDateStr = start.toISOString().split("T")[0];
    const endDateStr = end.toISOString().split("T")[0];

    const res = await getDashboardData(startDateStr, endDateStr);
    if (res.success && res.entries) {
      setEntries(res.entries);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [filterType]);

  const total = entries.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCash = entries.filter(e => e.method === "CASH").reduce((acc, curr) => acc + curr.amount, 0);
  const totalTransfer = entries.filter(e => e.method === "TRANSFER").reduce((acc, curr) => acc + curr.amount, 0);

  const handleExport = () => {
    if (entries.length === 0) {
      alert("Không có dữ liệu để xuất");
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

    const fileName = `BaoCao_ChiTieu_${filterType}_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="space-y-6">
      {/* Bộ lọc */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType("today")}
          className={`flex-1 py-2 rounded-xl font-medium transition-colors border ${
            filterType === "today" ? "bg-primary-600 text-surface-base border-primary-600" : "bg-surface-base text-ink-primary border-primary-200"
          }`}
        >
          Hôm nay
        </button>
        <button
          onClick={() => setFilterType("month")}
          className={`flex-1 py-2 rounded-xl font-medium transition-colors border ${
            filterType === "month" ? "bg-primary-600 text-surface-base border-primary-600" : "bg-surface-base text-ink-primary border-primary-200"
          }`}
        >
          Tháng này
        </button>
        <button
          onClick={() => setFilterType("year")}
          className={`flex-1 py-2 rounded-xl font-medium transition-colors border ${
            filterType === "year" ? "bg-primary-600 text-surface-base border-primary-600" : "bg-surface-base text-ink-primary border-primary-200"
          }`}
        >
          Năm nay
        </button>
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

      {/* Hành động */}
      <button
        onClick={handleExport}
        disabled={isLoading || entries.length === 0}
        className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 transition-all text-white font-semibold text-lg flex items-center justify-center shadow-sm gap-2"
      >
        <span>📥</span> Xuất file Excel
      </button>
    </div>
  );
}
