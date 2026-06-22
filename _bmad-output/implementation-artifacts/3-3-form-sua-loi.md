---
title: "Story 3.3: Form Sửa Lỗi (Append-only Correction)"
status: done
---

# Story 3.3: Form Sửa Lỗi (Append-only Correction)

## 📖 Story Foundation

**User Story:**
As a Quản lý/Nhân viên,
I want có thể sửa lại một khoản chi nếu vô tình nhập sai (sai số tiền, sai tên hàng),
So that báo cáo cuối ngày chính xác, nhưng hệ thống vẫn phải lưu vết quá trình sửa (Append-only) để chống gian lận.

**Acceptance Criteria:**
1. **Given** người dùng đang ở trang Lịch sử
   **When** bấm vào một phiếu nhập bất kỳ (ngoại trừ các phiếu có amount < 0)
   **Then** mở ra một màn hình hoặc Dialog (Popup) chứa Form thông tin đã được điền sẵn dữ liệu của phiếu đó.
2. **Given** Form sửa lỗi đang mở
   **When** người dùng sửa dữ liệu (VD: sửa 50,000 thành 60,000) và bấm nút "Cập nhật"
   **Then** hệ thống gọi Server Action thực hiện nguyên tắc **Append-only Correction**. Nó sẽ KHÔNG chạy lệnh `UPDATE` hay `DELETE` trong CSDL.
   **And** hệ thống tự động `INSERT` 2 dòng mới vào CSDL:
     - Dòng 1 (Phiếu bù trừ/Hủy): Dữ liệu y hệt phiếu cũ, nhưng số tiền bị đảo dấu (50,000 thành -50,000). Ghi chú được tự động thêm chữ `[HỦY PHIẾU CŨ]`.
     - Dòng 2 (Phiếu mới): Dữ liệu mới đã được sửa (60,000).
3. **Given** người dùng ở trang Lịch sử
   **When** danh sách tải lại
   **Then** các phiếu có `amount < 0` (Phiếu bù trừ) phải được làm mờ đi, gạch ngang, hoặc hiển thị một nhãn đỏ "Đã hủy" để dễ phân biệt.

---

## 🛠️ Developer Context & Guardrails

### 1. Kiến trúc & Logic (Append-only)
- Đây là tính năng cốt lõi của hệ thống. Chúng ta dùng `INSERT` thay vì `UPDATE` để lưu lại dấu vết ai đã sửa cái gì.
- Trong `src/actions/entries.ts`, tạo Server Action mới: `correctEntry(oldEntry: EntryRow, newData: CreateEntryPayload)`.
- Action này gọi `supabase.from('entries').insert([...])` với 1 mảng chứa 2 object (1 âm, 1 dương). Bằng cách này, Supabase sẽ insert cùng lúc (transaction-like).
- `created_by` của cả 2 dòng mới sẽ là người đang thao tác sửa (lấy từ `localStorage`).

### 2. Giao diện (UX/UI)
- Trên `HistoryPage`, biến mỗi Item trong danh sách thành một button/link có thể click.
- Vì cần quản lý state để mở Popup (Dialog/Drawer), ta cần tách từng Row của danh sách thành một Client Component (VD: `HistoryItem`), hoặc bọc toàn bộ danh sách trong Client Component. Lựa chọn tối ưu: Tạo component `HistoryList` (Client) nhận props `entries` từ Server.
- Khi click vào Item, mở một Modal. Ta có thể tái sử dụng logic của `EntryForm` nhưng biến tấu thành `<EditEntryForm />`.

### 3. Hiển thị UI Phiếu bị hủy
- Bất kỳ phiếu nào có `amount < 0` phải được render với UI đặc biệt (ví dụ: chữ màu đỏ, text có gạch ngang line-through, thêm badge `HỦY`).

---
*Ghi chú hoàn thành:* Ultimate context engine analysis completed - comprehensive developer guide created.
