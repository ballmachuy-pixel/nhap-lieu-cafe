---
title: "Story 1.3: Màn hình Định Danh (Identity Login - Honor System)"
status: review
---

# Story 1.3: Màn hình Định Danh (Identity Login - Honor System)

## 📖 Story Foundation

**User Story:**
As a Người dùng (Chủ/Nhân viên),
I want chạm vào tên mình trên màn hình thay vì gõ mật khẩu,
So that tôi có thể truy cập hệ thống ngay lập tức mà hệ thống vẫn lưu lại được dấu vết (ai nhập phiếu nào).

**Acceptance Criteria:**
1. **Given** người dùng lần đầu mở app (chưa có dữ liệu `localStorage`)
   **When** họ truy cập URL bất kỳ
   **Then** họ bị đẩy về trang `/login` hiển thị 3 nút bấm lớn: "Chủ quán", "Nhân viên 1", "Nhân viên 2"
2. **Given** người dùng ở trang `/login`
   **When** Khi bấm chọn 1 trong 3 định danh
   **Then** hệ thống lưu định danh vào `localStorage` và chuyển hướng vào `/` (Trang chủ)
3. **Given** người dùng đã chọn định danh ở lần mở app trước (đã có `localStorage`)
   **When** họ truy cập ứng dụng
   **Then** họ vào thẳng Trang chủ không bị điều hướng, không cần hỏi lại.

---

## 🛠️ Developer Context & Guardrails

### 1. Kiến trúc & Framework
- **Next.js App Router:** Do `localStorage` chỉ tồn tại ở Client, bạn **KHÔNG THỂ** dùng Next.js Middleware để chặn truy cập (vì Middleware chạy trên server không đọc được localStorage). 
- Hãy sử dụng một Client Component (ví dụ: `AuthProvider` hoặc một hook `useAuth` trong `layout.tsx` client-side) để kiểm tra `localStorage` và tự redirect về `/login` nếu chưa có thông tin.
- Hoặc đơn giản hơn: Trạng thái Honor System này có thể được đồng bộ vào 1 Cookie nhỏ từ client side, để Middleware có thể đọc được và không gây ra hiện tượng chớp màn hình (FOUC). **Tuy nhiên, để giữ hệ thống siêu đơn giản theo phương châm của dự án, việc kiểm tra ở Client Component (useEffect) là hoàn toàn chấp nhận được.**

### 2. Giao diện (UX/UI)
- Màn hình `/login` phải được thiết kế Mobile-first.
- Các nút bấm phải to, rõ ràng, có vùng chạm (touch-target) > 48px.
- Sử dụng các Design Tokens đã được định nghĩa ở Story 1.1 (`surface-base` cho background, `primary-500` hoặc `primary-600` cho nút bấm).
- Thiết kế dạng Flat, không đổ bóng, bo góc 8px - 16px (corner-radius).

### 3. File Structure Requirements
- `src/app/login/page.tsx`: Màn hình chứa 3 nút bấm.
- `src/components/auth-guard.tsx` (hoặc tương đương): Component wrapper để kiểm tra quyền truy cập.

### 4. Testing & Validation
- Mở ẩn danh, vào `/` -> Phải bị đẩy về `/login`.
- Ở `/login`, bấm "Chủ quán" -> Phải chuyển về `/` và nếu refresh thì không bị đẩy về `/login` nữa.
- Xóa localStorage thủ công trên DevTools -> refresh -> Phải bị đẩy về `/login`.

---
*Ghi chú hoàn thành:* Ultimate context engine analysis completed - comprehensive developer guide created.
