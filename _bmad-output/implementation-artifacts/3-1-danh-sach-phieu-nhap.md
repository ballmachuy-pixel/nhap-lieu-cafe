---
title: "Story 3.1: Danh sách Phiếu nhập"
status: done
---

# Story 3.1: Danh sách Phiếu nhập

## 📖 Story Foundation

**User Story:**
As a Người dùng,
I want xem danh sách các khoản đã chi trong ngày,
So that tôi biết mình đã ghi những gì và kiểm tra xem có bị sót không.

**Acceptance Criteria:**
1. **Given** người dùng truy cập trang Lịch sử (`/history`)
   **When** giao diện được render
   **Then** hệ thống gọi Server Action để lấy danh sách tối đa 100 phiếu nhập mới nhất từ Supabase, sắp xếp theo thời gian mới nhất lên đầu (`date DESC, created_at DESC`).
2. **Given** danh sách phiếu nhập đã được tải
   **When** người dùng lướt xem trên điện thoại
   **Then** mỗi phiếu hiển thị dạng một "thẻ" (Card) hoặc dòng (Row) lớn dễ nhìn.
   **And** hiển thị đầy đủ thông tin: Tên hàng, Số tiền (được format), Số lượng + Đơn vị, Ngày mua, và Hình thức thanh toán (Tiền mặt/Chuyển khoản).
3. **Given** người dùng đang ở trang Chủ (Form nhập liệu)
   **When** người dùng muốn xem lịch sử
   **Then** có một nút hoặc link điều hướng rõ ràng sang trang `/history`. (Và ngược lại, từ `/history` có nút quay về trang Chủ).

---

## 🛠️ Developer Context & Guardrails

### 1. Kiến trúc & Supabase
- Thêm một Server Action `getRecentEntries` trong `src/actions/entries.ts`.
- Sử dụng hàm Supabase `select` cơ bản, thêm `order('date', { ascending: false }).order('created_at', { ascending: false }).limit(100)`.
- Không cần RLS policy đặc biệt vì chúng ta dùng Service Role Key cho mọi thao tác.

### 2. Giao diện (UX/UI)
- Tạo mới thư mục `src/app/history/page.tsx`.
- Giao diện dạng List: Mỗi item có icon hoặc màu sắc để phân biệt Tiền mặt (VD: màu xanh lá) và Chuyển khoản (VD: màu xanh dương).
- Layout phải có Header có nút Back `<-- Quay lại Nhập liệu`.
- Trong `src/app/page.tsx` (trang chủ), thêm một nút hoặc Link `Xem lịch sử` ở góc trên cùng (cạnh thẻ tên).

### 3. Tối ưu Rendering
- Trang `/history` có thể là Server Component hoàn toàn, gọi trực tiếp Action `getRecentEntries()` lúc render để tối ưu SEO và tốc độ, không cần dùng `useEffect` ở Client.
- Chú ý: Cần thêm `export const dynamic = "force-dynamic";` để Next.js không cache trang Lịch sử (do dữ liệu thay đổi liên tục).

### 4. Bỏ qua trong Story này
- Chưa cần làm bộ lọc theo ngày (Sẽ làm ở Story 3.2).
- Chưa cần làm nút "Sửa/Xóa" (Sẽ làm ở Story 3.3).

---
*Ghi chú hoàn thành:* Ultimate context engine analysis completed - comprehensive developer guide created.
