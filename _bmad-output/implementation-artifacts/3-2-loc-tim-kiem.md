---
title: "Story 3.2: Bộ lọc Tìm kiếm Lịch sử"
status: done
---

# Story 3.2: Bộ lọc Tìm kiếm Lịch sử

## 📖 Story Foundation

**User Story:**
As a Người dùng,
I want lọc danh sách phiếu nhập theo một ngày cụ thể,
So that tôi có thể xem lại chính xác các khoản chi của ngày hôm qua hoặc tuần trước mà không phải lướt màn hình mỏi tay.

**Acceptance Criteria:**
1. **Given** người dùng truy cập trang Lịch sử (`/history`)
   **When** nhìn lên phía trên cùng của danh sách
   **Then** hệ thống hiển thị một thanh công cụ (Toolbar) chứa ô chọn Ngày.
2. **Given** người dùng sử dụng ô chọn Ngày
   **When** người dùng chọn một ngày cụ thể (ví dụ: `2026-06-20`)
   **Then** danh sách phía dưới tự động cập nhật, CHỈ hiển thị các phiếu nhập thuộc ngày `2026-06-20`.
   **And** URL trình duyệt tự động cập nhật Query Parameter (VD: `?date=2026-06-20`) để nếu copy link gửi người khác thì người đó cũng xem được đúng ngày đó.
3. **Given** người dùng đang xem kết quả đã lọc
   **When** người dùng bấm nút "Xóa lọc" hoặc xóa trắng ô chọn Ngày
   **Then** danh sách tự động tải lại 100 phiếu mới nhất từ tất cả các ngày (như Story 3.1).

---

## 🛠️ Developer Context & Guardrails

### 1. Kiến trúc & Data Fetching (Next.js App Router)
- Cập nhật Server Action `getRecentEntries(filterDate?: string)` trong `src/actions/entries.ts`. Nếu có truyền `filterDate`, ta gắn thêm `.eq('date', filterDate)`.
- Ở file `src/app/history/page.tsx`, lấy tham số `date` từ `searchParams` của trang. 
- Component Trang `/history` sẽ truyền giá trị ngày xuống Server Action.

### 2. Giao diện (UX/UI)
- Thêm file component `src/app/history/filter-bar.tsx` (Client Component) để chứa `<input type="date" />`.
- Khi người dùng thay đổi giá trị của `<input type="date">`, sử dụng `useRouter` của `next/navigation` để push param `?date=YYYY-MM-DD`. Chú ý dùng `router.push` thay vì fetch lại client-side để tận dụng Server Component của Next.js (hỗ trợ SEO tốt và code gọn hơn).
- Cung cấp một nút "Xóa" kế bên nếu ô date đang có giá trị.

### 3. Tối ưu Rendering
- Next.js Server Components sẽ tự động render lại trang khi Query Parameters (`searchParams`) thay đổi. Nhờ vậy chúng ta không cần viết thêm hàm loading spinner hay state management phức tạp.
- Đảm bảo form chọn ngày có thiết kế đồng nhất với form nhập liệu (chiều cao h-12, border mỏng).

---
*Ghi chú hoàn thành:* Ultimate context engine analysis completed - comprehensive developer guide created.
