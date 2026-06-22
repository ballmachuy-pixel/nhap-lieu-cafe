"use client";

import { useState } from "react";
import { formatCurrency, parseCurrency, getTodayStr, getMinDateStr } from "@/lib/utils";
import { Autocomplete } from "@/components/autocomplete";
import { searchItems, searchSuppliers, SearchItemResult, SearchSupplierResult } from "@/actions/search";
import { createEntry } from "@/actions/entries";
import { toast } from "sonner";

const COMMON_UNITS = ["kg", "lít", "cái", "hộp", "gói", "bó", "lạng", "chai", "lon", "túi"];

export function EntryForm({ sessionName }: { sessionName: string }) {
  const [date, setDate] = useState(getTodayStr());
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [customUnit, setCustomUnit] = useState("");
  const [supplier, setSupplier] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [method, setMethod] = useState<"CASH" | "TRANSFER">("CASH");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatCurrency(rawValue);
    setAmountStr(formatted);
  };

  const handleSelectItem = (item: SearchItemResult) => {
    if (item.unit) {
      if (COMMON_UNITS.includes(item.unit)) {
        setUnit(item.unit);
      } else {
        setUnit("Khác");
        setCustomUnit(item.unit);
      }
    }
    if (item.amount) {
      setAmountStr(formatCurrency(item.amount));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const finalUnit = unit === "Khác" ? customUnit : unit;
    const finalAmount = parseCurrency(amountStr);

    if (!name || finalAmount <= 0) {
      toast.error("Vui lòng nhập Tên hàng hóa và Số tiền hợp lệ");
      return;
    }

    const createdBy = sessionName || "Không xác định";

    setIsSubmitting(true);
    const toastId = toast.loading("Đang lưu phiếu...");

    const data = {
      date,
      name,
      quantity: quantity ? parseFloat(quantity) : null,
      unit: finalUnit || null,
      supplier: supplier || null,
      amount: finalAmount,
      method,
      note: note || null,
      created_by: createdBy,
    };

    const res = await createEntry(data);

    if (res.success) {
      toast.success("Đã lưu phiếu nhập!", { id: toastId });
      
      // Optimistic UI: Reset form (giữ lại date và method)
      setName("");
      setQuantity("");
      setUnit("kg");
      setCustomUnit("");
      setSupplier("");
      setAmountStr("");
      setNote("");
    } else {
      toast.error("Lỗi: " + res.error, { id: toastId });
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Ngày */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-primary-900">Ngày mua</label>
        <input
          type="date"
          required
          value={date}
          min={getMinDateStr(30)}
          max={getTodayStr()}
          onChange={(e) => setDate(e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
        />
      </div>

      {/* Tên hàng hóa */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-primary-900">Tên hàng hóa</label>
        <Autocomplete<SearchItemResult>
          value={name}
          onChange={setName}
          onSelect={handleSelectItem}
          fetchData={searchItems}
          placeholder="VD: Cà phê hạt..."
          required={true}
          getInputValue={(item) => item.name}
          renderItem={(item) => (
            <div className="w-full flex justify-between items-center">
              <span className="font-medium text-ink-primary">{item.name}</span>
              <span className="text-sm text-primary-600">
                {item.amount ? `${formatCurrency(item.amount)} ₫` : ""}
                {item.unit ? ` / ${item.unit}` : ""}
              </span>
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Số lượng */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-primary-900">Số lượng (tùy chọn)</label>
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
        </div>

        {/* Đơn vị */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-primary-900">Đơn vị</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow appearance-none"
          >
            {COMMON_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
            <option value="Khác">Khác...</option>
          </select>
        </div>
      </div>

      {/* Đơn vị khác */}
      {unit === "Khác" && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-primary-900">Nhập đơn vị khác</label>
          <input
            type="text"
            required
            placeholder="VD: thùng"
            value={customUnit}
            onChange={(e) => setCustomUnit(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
        </div>
      )}

      {/* Nhà cung cấp */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-primary-900">Nhà cung cấp (tùy chọn)</label>
        <Autocomplete<SearchSupplierResult>
          value={supplier}
          onChange={setSupplier}
          fetchData={searchSuppliers}
          placeholder="VD: Cô Hai chợ đầu mối"
          getInputValue={(item) => item.supplier}
          renderItem={(item) => (
            <div className="w-full font-medium text-ink-primary">
              {item.supplier}
            </div>
          )}
        />
      </div>

      {/* Số tiền */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-primary-900">Số tiền (VNĐ)</label>
        <div className="relative">
          <input
            type="text"
            required
            inputMode="numeric"
            placeholder="0"
            value={amountStr}
            onChange={handleAmountChange}
            className="w-full h-14 pl-4 pr-12 rounded-xl border border-primary-200 bg-surface-base text-ink-primary font-bold text-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 font-medium">₫</span>
        </div>
      </div>

      {/* Hình thức thanh toán */}
      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-primary-900">Hình thức thanh toán</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod("CASH")}
            className={`h-12 rounded-xl border font-medium transition-all ${
              method === "CASH"
                ? "bg-primary-50 border-primary-500 text-primary-700"
                : "border-primary-200 text-primary-600 bg-surface-base"
            }`}
          >
            Tiền mặt
          </button>
          <button
            type="button"
            onClick={() => setMethod("TRANSFER")}
            className={`h-12 rounded-xl border font-medium transition-all ${
              method === "TRANSFER"
                ? "bg-primary-50 border-primary-500 text-primary-700"
                : "border-primary-200 text-primary-600 bg-surface-base"
            }`}
          >
            Chuyển khoản
          </button>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="space-y-1 pt-2">
        <label className="text-sm font-medium text-primary-900">Ghi chú (tùy chọn)</label>
        <textarea
          maxLength={500}
          rows={3}
          placeholder="Thêm ghi chú nếu cần..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow resize-none"
        />
      </div>

      {/* Nút Submit */}
      <div className="pt-4 pb-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-surface-base font-bold text-lg shadow-sm"
        >
          {isSubmitting ? "ĐANG LƯU..." : "LƯU PHIẾU NHẬP"}
        </button>
      </div>
    </form>
  );
}
