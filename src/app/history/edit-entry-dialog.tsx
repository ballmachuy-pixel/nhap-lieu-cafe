"use client";

import { useState } from "react";
import { EntryRow, correctEntry } from "@/actions/entries";
import { formatCurrency, parseCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function EditEntryDialog({
  entry,
  onClose,
}: {
  entry: EntryRow;
  onClose: () => void;
}) {
  const router = useRouter();
  
  const [date, setDate] = useState(entry.date);
  const [name, setName] = useState(entry.name);
  const [quantity, setQuantity] = useState(entry.quantity ? String(entry.quantity) : "");
  const [unit, setUnit] = useState(entry.unit || "kg");
  const [supplier, setSupplier] = useState(entry.supplier || "");
  const [amountStr, setAmountStr] = useState(formatCurrency(entry.amount));
  const [method, setMethod] = useState<"CASH" | "TRANSFER">(entry.method);
  const [note, setNote] = useState(entry.note || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatCurrency(rawValue);
    setAmountStr(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const finalAmount = parseCurrency(amountStr);

    if (!name || finalAmount <= 0) {
      toast.error("Vui lòng nhập Tên hàng hóa và Số tiền hợp lệ");
      return;
    }

    const createdBy = localStorage.getItem("honor_identity") || "Không xác định";

    setIsSubmitting(true);
    const toastId = toast.loading("Đang sửa phiếu...");

    const data = {
      date,
      name,
      quantity: quantity ? parseFloat(quantity) : null,
      unit: unit || null,
      supplier: supplier || null,
      amount: finalAmount,
      method,
      note: note || null,
      created_by: createdBy,
    };

    const res = await correctEntry(entry, data);

    if (res.success) {
      toast.success("Đã cập nhật thành công!", { id: toastId });
      router.refresh();
      onClose();
    } else {
      toast.error("Lỗi: " + res.error, { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-primary-100 bg-surface-base">
          <h2 className="text-xl font-bold text-ink-primary">Sửa phiếu nhập</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="overflow-y-auto p-4">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink-primary">Ngày</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink-primary">Tên hàng hóa <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="VD: Cà phê hạt..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-ink-primary">Số lượng</label>
                <input
                  type="number"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="VD: 5"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-ink-primary">Đơn vị</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="VD: kg"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink-primary">Nhà cung cấp</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="VD: Chú Bảy..."
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink-primary">Số tiền <span className="text-red-500">*</span></label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={amountStr}
                onChange={handleAmountChange}
                className="w-full h-14 px-4 text-xl font-bold rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink-primary">Hình thức</label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-center h-12 rounded-xl border border-primary-200 bg-surface-base cursor-pointer has-[:checked]:bg-green-50 has-[:checked]:border-green-500 has-[:checked]:text-green-700 transition-colors">
                  <input
                    type="radio"
                    name="editMethod"
                    value="CASH"
                    checked={method === "CASH"}
                    onChange={() => setMethod("CASH")}
                    className="sr-only"
                  />
                  <span className="font-semibold">Tiền mặt</span>
                </label>
                <label className="flex-1 flex items-center justify-center h-12 rounded-xl border border-primary-200 bg-surface-base cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:text-blue-700 transition-colors">
                  <input
                    type="radio"
                    name="editMethod"
                    value="TRANSFER"
                    checked={method === "TRANSFER"}
                    onChange={() => setMethod("TRANSFER")}
                    className="sr-only"
                  />
                  <span className="font-semibold">Chuyển khoản</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink-primary">Ghi chú</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ghi chú thêm..."
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-primary-100 bg-surface-base flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="edit-form"
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-surface-base font-bold shadow-sm"
          >
            {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}
