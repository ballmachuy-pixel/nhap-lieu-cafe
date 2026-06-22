# Story 1.2: Thiết lập Database Supabase & Append-only Schema

Status: done

## Story

As a System Architect,
I want tạo bảng `entries` trên Supabase với RLS chặn Update/Delete và bật `unaccent`,
So that CSDL sẵn sàng lưu trữ phiếu nhập theo đúng nguyên tắc bảo vệ dữ liệu chống xóa sửa (Tamper-proof).

## Acceptance Criteria

1. **Given** môi trường Supabase project mới
   **When** chạy file SQL migration khởi tạo schema
   **Then** bảng `entries` được tạo với các cột cần thiết (date, item_name, quantity, unit, vendor, amount, method, note, created_by, corrected_by, correction_for_id)
   **And** Row Level Security (RLS) policies chỉ cho phép `INSERT` và `SELECT`, chặn hoàn toàn `UPDATE` và `DELETE`
   **And** extension `unaccent` được kích hoạt phục vụ tìm kiếm

## Tasks / Subtasks

- [ ] Task 1: Thiết lập Supabase Client (AC: 1)
  - [ ] Cài đặt `@supabase/supabase-js`.
  - [ ] Khởi tạo Supabase client utilities trong thư mục `src/lib/supabase.ts` sử dụng biến môi trường.
- [ ] Task 2: SQL Migration Script (AC: 1)
  - [ ] Tạo file SQL migration (ví dụ: `supabase/migrations/00000_init.sql`).
  - [ ] Bật extension `unaccent`.
  - [ ] Tạo bảng `entries` với các cột chuẩn xác, đặc biệt là quan hệ self-referencing cho `correction_for_id`.
  - [ ] Thiết lập Row Level Security (RLS) policies để cho phép `INSERT` và `SELECT`, chặn `UPDATE` và `DELETE`.

## Dev Notes

### Architecture & Constraints
- **Append-only Schema**: Tuyệt đối không được cấp quyền `UPDATE` hay `DELETE` cho user. Mọi lỗi nhập liệu sẽ được bù trừ bằng một bản ghi mới (phiếu đính chính).
- **Honor System**: Không dùng bảng `users`. Danh tính sẽ được lưu dưới dạng chuỗi `created_by` (Lấy từ localStorage).
- **Search Optimization**: Cần extension `unaccent` để hỗ trợ tìm kiếm Tiếng Việt không dấu (ví dụ gõ "ca" tìm ra "Cà phê").

### Previous Story Intelligence
- Đã khởi tạo Next.js 16.2 (App Router, Tailwind CSS v4, TypeScript).
- Design system với các biến CSS trong `globals.css` đã hoàn tất.
- Lưu ý: Không cài các dependencies không cần thiết. Giữ project gọn nhẹ.

### References
- [Source: planning-artifacts/epics.md#Story-1.2]
- [Source: planning-artifacts/architecture.md#Database]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
