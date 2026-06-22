"use client";

import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 hover:bg-red-100 transition-colors ml-2"
    >
      Đăng xuất
    </button>
  );
}
