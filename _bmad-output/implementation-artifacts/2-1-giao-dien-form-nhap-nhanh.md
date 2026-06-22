---
title: "Story 2.1: Giao diện Form Nhập Nhanh (Quick Entry UI)"
status: done
---

# Story 2.1: Giao diện Form Nhập Nhanh (Quick Entry UI)

## 📖 Story Foundation

**User Story:**
As a Người dùng,
I want nhìn thấy một form nhập liệu với các ô nhập lớn, dễ bấm và ngày tháng mặc định là hôm nay,
So that tôi không bị bấm nhầm khi đang cầm đồ ở chợ và bớt được thao tác chọn ngày.

**Acceptance Criteria:**
1. **Given** người dùng truy cập Trang chủ (`/`)
   **When** form nhập liệu được hiển thị
   **Then** giao diện tuân thủ Mobile-first với các input box có touch-target lớn (chiều cao tối thiểu 48px, viền hairline).
2. **Given** người dùng thao tác nhập liệu trên điện thoại
   **When** họ chạm vào ô Số lượng hoặc Số tiền
   **Then** điện thoại phải ép bật bàn phím số lập tức (`inputMode="decimal"` cho số lượng, `inputMode="numeric"` cho số tiền).
3. **Given** form khởi tạo ban đầu
   **When** người dùng nhìn vào trường Ngày và Hình thức thanh toán
   **Then** trường Ngày tự động điền ngày hiện tại theo giờ Việt Nam. Chặn chọn ngày tương lai hoặc quá 30 ngày trong quá khứ.
   **And** Hình thức thanh toán mặc định là "Tiền mặt".
4. **Given** người dùng chọn Đơn vị
   **When** danh sách Đơn vị xổ xuống
   **Then** có sẵn 10 loại phổ biến (kg, lít, cái, hộp, gói, bó, lạng, chai, lon, túi) và một mục "Khác".
   **And** nếu chọn "Khác", hiển thị thêm một ô nhập text để tự gõ đơn vị.

---

## 🛠️ Developer Context & Guardrails

### 1. Phân tích các trường dữ liệu cần có (để khớp với Database)
- **Ngày mua (`date`)**: `<input type="date" />`, logic tính toán min/max date bằng JS.
- **Tên hàng hóa (`name`)**: `<input type="text" />` (Story 2.2 sẽ làm autocomplete, ở story này chỉ dựng UI cơ bản).
- **Số lượng (`quantity`)**: `<input type="number" step="0.1" inputMode="decimal" />`
- **Đơn vị (`unit`)**: `<select>` và conditional `<input type="text" />` nếu chọn Khác.
- **Nhà cung cấp (`supplier`)**: `<input type="text" />` (Story 2.2 sẽ làm autocomplete).
- **Số tiền (`amount`)**: `<input type="text" inputMode="numeric" />`. Cần format có dấu phẩy (phân cách hàng nghìn) khi user gõ, hoặc dùng một thư viện hỗ trợ format tiền tệ đơn giản (như `react-number-format` hoặc tự viết hàm format).
- **Hình thức thanh toán (`method`)**: Radio buttons hoặc Toggle (Tiền mặt / Chuyển khoản).
- **Ghi chú (`note`)**: `<textarea maxLength={500} />`.

### 2. Giao diện (UX/UI)
- Toàn bộ Form đặt tại `src/app/page.tsx` (có thể tách ra `src/components/entry-form.tsx`).
- Touch-target lớn: Các input và nút bấm phải dùng class Tailwind `h-12` (48px) hoặc lớn hơn.
- Không dùng shadow (đổ bóng), dùng border mỏng (`border border-primary-200`) và background xám nhẹ.
- Trạng thái `:focus` phải đổi màu border sang `border-primary-500` hoặc dùng `ring-primary-500` để báo hiệu rõ ràng ô đang nhập.
- Nút "LƯU PHIẾU" to, dính ở dưới cùng (hoặc chiếm full width ở dưới cùng) màu xanh lá đậm (`bg-primary-600`).

### 3. File Structure Requirements
- `src/components/entry-form.tsx`: Component chính chứa form nhập liệu (Client Component vì có state).
- `src/app/page.tsx`: Layout chính, render `<EntryForm />`.

### 4. Bỏ qua trong Story này
- **Không gọi API lưu**: Việc xử lý submit Server Action sẽ được làm ở Story 2.3. Trong Story này, nút Lưu chỉ cần `console.log` data.
- **Không Autocomplete**: Sẽ làm ở Story 2.2.

---
*Ghi chú hoàn thành:* Ultimate context engine analysis completed - comprehensive developer guide created.
