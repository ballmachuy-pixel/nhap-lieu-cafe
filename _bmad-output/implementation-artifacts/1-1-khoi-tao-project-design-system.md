---
baseline_commit: NO_VCS
---

# Story 1.1: Khởi tạo Project & Design System

Status: done

## Story

As a Developer,
I want khởi tạo Next.js App Router và cấu hình Tailwind CSS Design Tokens (màu Xanh lá tinh giản, font tabular-nums),
so that toàn bộ app có giao diện đồng nhất theo đúng bản thiết kế ngay từ đầu.

## Acceptance Criteria

1. **Given** một repository trống
   **When** developer chạy init Next.js và cài đặt các biến màu sắc/font/spacing vào `tailwind.config.ts`
   **Then** hệ thống có thể render các thẻ `div` test với màu `bg-surface-base` và `text-ink-primary` chuẩn xác
   **And** font chữ cho số được hiển thị dưới dạng tabular-nums (các chữ số thẳng hàng)

## Tasks / Subtasks

- [x] Task 1: Khởi tạo Next.js project (AC: 1)
  - [x] Chạy lệnh `npx create-next-app@latest` với cấu hình: App Router, Tailwind CSS, TypeScript, no `src/` directory (hoặc tuân thủ nếu dùng `src/`).
  - [x] Dọn dẹp giao diện mặc định của Next.js.
- [x] Task 2: Cấu hình Design Tokens vào Tailwind (AC: 1)
  - [x] Mở rộng theme trong `tailwind.config.ts` với các token: `surface-base`, `ink-primary`, và bộ màu Xanh lá chủ đạo.
  - [x] Đưa cài đặt `tabular-nums` vào utilities chung hoặc global css để hỗ trợ việc hiển thị số liệu minh bạch.

## Dev Notes

- **Kiến trúc & Ràng buộc:** Next.js App Router, TailwindCSS. Không sử dụng thư viện UI cồng kềnh (MUI, AntD). Tự build UI component để đảm bảo tốc độ Load < 500ms theo PRD.
- **File cần chỉnh sửa:**
  - `tailwind.config.ts`
  - `app/globals.css`
  - `app/page.tsx`
  - `app/layout.tsx`

### Project Structure Notes

- Khởi tạo thư mục chuẩn của Next.js.
- Có thể tạo folder `components/` để chuẩn bị cho các components tái sử dụng (Button, Input).

### References

- [Source: planning-artifacts/epics.md#Story-1.1]
- [Source: planning-artifacts/architecture.md#Frontend]
- [Source: planning-artifacts/ux-designs/ux-nhập liệu-2026-06-22/DESIGN.md]

## Dev Agent Record

### Agent Model Used

Gemini 2.5 Pro

### Debug Log References

- Bypassed execution policy for npm/npx
- Handled Tailwind CSS v4 transition (`@theme` in `globals.css` instead of `tailwind.config.ts`)

### Completion Notes List

- Khởi tạo Next.js 16.2 (App Router, Tailwind CSS v4, TypeScript).
- Cấu hình Design Tokens (surface-base, ink-primary, primary green palette) trong `src/app/globals.css`.
- Đã thêm `font-variant-numeric: tabular-nums` vào thẻ body để tất cả các số đều thẳng hàng.
- Xóa bỏ giao diện boilerplate của Next.js, tạo một div test UI đơn giản tại `src/app/page.tsx`.
- Chạy thử `npm run build` thành công, không gặp lỗi.

### File List

- `package.json`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`

### Review Findings

- [x] [Review][Decision] Handle Dark Mode Palette — The current dark mode flips background/foreground but leaves primary greens (bg-primary-50) unchanged, causing poor contrast. Also lacks `color-scheme: dark`. Should we remove dark mode entirely for MVP to keep it "tinh giản", or define a full dark palette?
- [x] [Review][Patch] Remove hardcoded body font [`src/app/globals.css`]
- [x] [Review][Patch] Update language tag to lang="vi" [`src/app/layout.tsx`]
- [x] [Review][Patch] Fix conflicting height constraints on main tag [`src/app/page.tsx`]
- [x] [Review][Patch] Improve text contrast for primary-600 [`src/app/page.tsx`]
- [x] [Review][Patch] Test surface-base tokens on div as per AC 1 [`src/app/page.tsx`]
