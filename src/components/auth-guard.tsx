"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Lấy thông tin định danh từ localStorage
    const identity = localStorage.getItem("honor_identity");

    if (!identity) {
      // Nếu chưa có định danh và đang ở trang khác trang login
      if (pathname !== "/login") {
        router.push("/login");
      } else {
        // Đã ở trang login, an toàn để hiển thị
        setIsReady(true);
      }
    } else {
      // Đã có định danh
      if (pathname === "/login") {
        // Nếu đang ở trang login thì đẩy về trang chủ
        router.push("/");
      } else {
        // Đã đăng nhập và đang ở các trang cần bảo vệ
        setIsReady(true);
      }
    }
  }, [pathname, router]);

  // Tránh FOUC bằng cách không render gì cho đến khi kiểm tra xong auth
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <p className="text-primary-600 animate-pulse">Đang tải...</p>
      </div>
    );
  }

  return <>{children}</>;
}
