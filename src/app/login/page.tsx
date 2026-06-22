"use client";

import { useRouter } from "next/navigation";

const IDENTITIES = [
  { id: "chu_quan", label: "Chủ quán" },
  { id: "nhan_vien_1", label: "Nhân viên 1" },
  { id: "nhan_vien_2", label: "Nhân viên 2" },
];

export default function LoginPage() {
  const router = useRouter();

  const handleSelectIdentity = (label: string) => {
    localStorage.setItem("honor_identity", label);
    // Chuyển hướng về trang chủ
    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface-base">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-ink-primary">Nhập Liệu Quán Cafe</h1>
          <p className="text-primary-700">Chọn người đang trực để bắt đầu</p>
        </div>

        <div className="space-y-4">
          {IDENTITIES.map((identity) => (
            <button
              key={identity.id}
              onClick={() => handleSelectIdentity(identity.label)}
              className="w-full h-16 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 transition-all text-surface-base font-semibold text-lg flex items-center justify-center shadow-sm"
            >
              {identity.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
