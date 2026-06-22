"use client";

import { useState } from "react";
import { EntryRow } from "@/actions/entries";
import { formatCurrency } from "@/lib/utils";
import { EditEntryDialog } from "./edit-entry-dialog";

export function HistoryList({ entries }: { entries: EntryRow[] }) {
  const [editingEntry, setEditingEntry] = useState<EntryRow | null>(null);

  // Nhóm phiếu theo ngày
  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      {entries.length === 0 ? (
        <div className="text-center text-primary-500 py-10">
          Chưa có phiếu nhập nào.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dayEntries = grouped[date];
            const dailyTotal = dayEntries.reduce((sum, e) => sum + e.amount, 0);

            // Format ngày: vd "22/06/2026"
            const dateObj = new Date(date);
            const dateStr = dateObj.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            });

            return (
              <div key={date} className="space-y-3">
                <div className="flex justify-between items-end border-b border-primary-200 pb-1">
                  <h2 className="font-bold text-primary-800">{dateStr}</h2>
                  <span className="text-sm font-medium text-primary-600">
                    Tổng: <span className="font-bold">{formatCurrency(dailyTotal)}</span>
                  </span>
                </div>

                <div className="space-y-3">
                  {dayEntries.map((entry) => {
                    const isCancelled = entry.amount < 0;
                    
                    return (
                      <div
                        key={entry.id}
                        onClick={() => {
                          if (!isCancelled) {
                            setEditingEntry(entry);
                          }
                        }}
                        className={`p-3 bg-white border border-primary-100 rounded-xl shadow-sm flex justify-between items-start transition-colors ${
                          isCancelled ? "opacity-60 bg-gray-50" : "hover:bg-primary-50 cursor-pointer active:scale-[0.99]"
                        }`}
                      >
                        <div className="space-y-1">
                          <p className={`font-semibold text-ink-primary ${isCancelled ? "line-through text-gray-500" : ""}`}>
                            {entry.name}
                          </p>
                          <p className="text-sm text-primary-500">
                            {entry.quantity && `${entry.quantity} `}
                            {entry.unit && `${entry.unit} `}
                            {entry.supplier && `• ${entry.supplier}`}
                          </p>
                          {entry.note && (
                            <p className="text-xs text-primary-400 italic">
                              {entry.note}
                            </p>
                          )}
                        </div>
                        <div className="text-right space-y-1">
                          <p className={`font-bold tabular-nums ${isCancelled ? "text-red-500" : "text-ink-primary"}`}>
                            {formatCurrency(entry.amount)}
                          </p>
                          {isCancelled ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                              ĐÃ HỦY
                            </span>
                          ) : (
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                entry.method === "CASH"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {entry.method === "CASH" ? "TIỀN MẶT" : "CHUYỂN KHOẢN"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingEntry && (
        <EditEntryDialog
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </>
  );
}
