import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/auth-guard";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Nhập Liệu Quán Cafe",
  description: "Phần mềm quản lý chi tiêu nội bộ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} min-h-screen bg-surface-base text-ink-primary flex flex-col`}>
        <AuthGuard>
          {children}
        </AuthGuard>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
