---
title: "Story 4.1: Thẻ Báo Cáo Tổng Chi Hôm Nay"
status: done
---

# Story 4.1: Thẻ Báo Cáo Tổng Chi Hôm Nay

## 📖 Story Foundation

**User Story:**
As a Chủ quán,
I want thấy tổng số tiền chi tiêu trong ngày ngay khi vừa mở app,
So that tôi nắm được ngân sách hôm nay đã tiêu bao nhiêu mà không cần phải nhẩm cộng tay từng khoản.

**Acceptance Criteria:**
1. **Given** người dùng truy cập trang Chủ (Trang Nhập liệu)
   **When** giao diện được render
   **Then** hiển thị một "Thẻ" (Card) to rõ ràng báo "Tổng chi hôm nay" bằng chữ đậm lớn (ví dụ: `1.500.000 VNĐ`).
2. **Given** thẻ báo cáo đang hiển thị
   **When** nhìn vào chi tiết
   **Then** ngay bên dưới số tổng, có phân tách cụ thể: bao nhiêu tiền mặt (CASH) và bao nhiêu chuyển khoản (TRANSFER).
3. **Given** hệ thống tính toán dữ liệu
   **When** query dữ liệu của ngày hôm nay
   **Then** tổng tiền (`amount`) là tổng hợp của TẤT CẢ các phiếu nhập thuộc ngày hôm nay. (Nhờ cơ chế Append-only, các phiếu âm bù trừ tự động cộng dồn và triệt tiêu phiếu sai, nên con số luôn chính xác tuyệt đối mà không cần logic IF ELSE phức tạp).

---

## 🛠️ Developer Context & Guardrails

### 1. Kiến trúc & Data Fetching
- Thêm một Server Action `getDailySummary(dateStr: string)` trong `src/actions/entries.ts`.
- Action này gọi Supabase `select('amount, method').eq('date', dateStr)`.
- Tính tổng `total`, `cashTotal`, `transferTotal` từ dữ liệu trả về.
- Lưu ý: Không cần lọc bỏ phiếu Hủy, chỉ cần gọi hàm `reduce` cộng dồn tất cả các `amount`, các phiếu hủy mang giá trị âm sẽ tự bù trừ.

### 2. Tối ưu Giao diện
- Xây dựng component mới: `src/components/daily-summary-card.tsx` (có thể là Server Component hoặc Client Component tùy cách cấu trúc). Tốt nhất là Server Component để tốc độ phản hồi cực nhanh.
- Thiết kế:
  - Một ô vuông/chữ nhật nền nổi bật (Ví dụ: Gradient xanh lá).
  - Chữ "HÔM NAY" nhỏ ở trên.
  - Số Tổng to bự ở giữa.
  - 2 cột nhỏ ở dưới: Tiền mặt | Chuyển khoản.
- Chèn Component này vào ngay đầu `src/app/page.tsx` (trên `<EntryForm />`).

### 3. Edge Cases
- Khi chưa có khoản chi nào trong ngày, hiển thị `0 VNĐ` rõ ràng để tạo sự yên tâm cho chủ quán.
- Thay đổi ngày trên máy tính/điện thoại sang ngày hôm sau thì mặc định sẽ thành `0 VNĐ` vì query theo ngày hiện tại (`getTodayStr()`).

---
*Ghi chú hoàn thành:* Ultimate context engine analysis completed - comprehensive developer guide created.
