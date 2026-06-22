---
title: "Story 2.3: Xử lý Lưu Phiếu & Trải nghiệm Optimistic UI"
status: done
---

# Story 2.3: Xử lý Lưu Phiếu & Trải nghiệm Optimistic UI

## 📖 Story Foundation

**User Story:**
As a Người dùng,
I want ứng dụng lưu ngay lập tức, xóa trắng form và báo thành công ở góc màn hình,
So that tôi biết tiền đã được ghi sổ và có thể gõ ngay món hàng tiếp theo.

**Acceptance Criteria:**
1. **Given** người dùng đã điền đủ thông tin bắt buộc (Tên hàng, Số tiền) trên Form Nhập Nhanh
   **When** bấm nút "LƯU PHIẾU NHẬP" ở dưới cùng
   **Then** ứng dụng gọi Server Action để insert dữ liệu vào bảng `entries`.
   **And** hệ thống phải tự động đọc `honor_identity` từ `localStorage` để truyền vào cột `created_by`.
2. **Given** người dùng bấm Lưu
   **When** API bắt đầu được gọi
   **Then** ngay lập tức trên UI (Optimistic UI), form phải được reset về trạng thái ban đầu (xóa Tên hàng, Số lượng, Số tiền, Đơn vị về mặc định... nhưng GIỮ NGUYÊN trường Ngày).
   **And** hiển thị một Snackbar/Toast ở góc màn hình báo "Đã lưu thành công!".
3. **Given** API lưu thất bại (lỗi mạng hoặc CSDL)
   **When** Server Action trả về lỗi
   **Then** hiển thị thông báo lỗi bằng Snackbar và KHÔNG mất dữ liệu cũ trên form (nếu đã trót xóa thì cần rollback lại data trên form, hoặc đơn giản hơn là chỉ reset form *sau khi* API trả về thành công).

---

## 🛠️ Developer Context & Guardrails

### 1. Kiến trúc & Supabase
- Tạo hàm Server Action mới trong `src/actions/entries.ts` tên là `createEntry`.
- Action này nhận payload là dữ liệu form kèm theo `created_by` (được đọc từ localStorage ở Client và gửi kèm payload).
- Action phải sử dụng Supabase Service Role Key (đã cấu hình ở file `src/lib/supabase.ts`) vì chúng ta đã tắt Insert public.
- Dữ liệu đẩy lên Supabase phải map đúng kiểu dữ liệu (amount là số nguyên, date là chuỗi YYYY-MM-DD, các trường rỗng truyền `null`).

### 2. Giao diện (UX/UI)
- **Snackbar/Toast:** Có thể tự build một component Toast đơn giản, hoặc cài đặt thư viện `sonner` hoặc `react-hot-toast`. Cài `sonner` (`npm install sonner`) là lựa chọn tối ưu, nhẹ và đẹp.
- **Trạng thái nút Lưu:** Nút LƯU PHIẾU nên có trạng thái `disabled` (hoặc hiển thị loader xoay xoay) trong tích tắc khi đang gọi API.
- Đảm bảo form reset lại toàn bộ các state (trừ trường ngày).

### 3. File Structure Requirements
- `src/actions/entries.ts`: Chứa Server Action `createEntry`.
- `src/components/entry-form.tsx`: Nâng cấp hàm `handleSubmit`, gọi action, quản lý Toast và reset form.
- Cài đặt thư viện: `npm install sonner` (nếu cần).

### 4. Testing & Validation
- Chọn tên hàng: Cà phê. Số tiền: 50,000. Bấm Lưu.
- Kiểm tra trên Database Supabase xem có dòng dữ liệu mới không, `created_by` có đúng với tên định danh đang trực không.
- UI báo Toast màu xanh lá và form xóa sạch chữ.

---
*Ghi chú hoàn thành:* Ultimate context engine analysis completed - comprehensive developer guide created.
