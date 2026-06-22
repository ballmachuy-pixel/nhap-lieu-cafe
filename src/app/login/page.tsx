"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithPin } from "@/actions/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async (num: string) => {
    if (isLoading || pin.length >= 4) return;
    const newPin = pin + num;
    setPin(newPin);

    if (newPin.length === 4) {
      setIsLoading(true);
      const res = await loginWithPin(newPin);
      if (res.success) {
        toast.success(`Đăng nhập thành công!`);
        router.push("/");
      } else {
        toast.error(res.message);
        setPin("");
        setIsLoading(false);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface-base">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-ink-primary">Đăng Nhập</h1>
          <p className="text-primary-700">Nhập mã PIN để vào ứng dụng</p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                i < pin.length ? "bg-primary-600 scale-110" : "bg-primary-200"
              }`}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              disabled={isLoading}
              onClick={() => handlePress(num.toString())}
              className="h-16 rounded-2xl bg-surface-base border border-primary-100 hover:bg-primary-50 active:bg-primary-200 text-2xl font-semibold text-ink-primary shadow-sm transition-colors"
            >
              {num}
            </button>
          ))}
          <div /> {/* Trống */}
          <button
            disabled={isLoading}
            onClick={() => handlePress("0")}
            className="h-16 rounded-2xl bg-surface-base border border-primary-100 hover:bg-primary-50 active:bg-primary-200 text-2xl font-semibold text-ink-primary shadow-sm transition-colors"
          >
            0
          </button>
          <button
            disabled={isLoading || pin.length === 0}
            onClick={handleDelete}
            className="h-16 rounded-2xl bg-surface-base border border-primary-100 hover:bg-primary-50 active:bg-primary-200 text-xl font-medium text-primary-600 shadow-sm transition-colors flex items-center justify-center"
          >
            Xóa
          </button>
        </div>
      </div>
    </main>
  );
}
