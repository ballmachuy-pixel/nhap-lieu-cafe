---
status: final
updated: 2026-06-22
---

# Experience Specification: Nhập Liệu Quán Cafe

## Foundation

Dự án này sử dụng Tailwind CSS kết hợp với hệ thống Design System thuần túy (không sử dụng component library cồng kềnh như MUI để đảm bảo tốc độ tải trang cực nhanh). Thiết kế được định hướng 100% Mobile-first, sau đó mới scale lên Desktop.

Visual Identity (Màu sắc, Typography, khoảng cách) được tham chiếu từ `DESIGN.md`. 

## Information Architecture

Ứng dụng có kiến trúc cực kỳ phẳng (Flat IA), chỉ gồm 2 trang chính để giảm ma sát thao tác:

1. **Trang Chọn Nhân Viên (Identity - `/login`)**:
   - Màn hình đầu tiên khi mở app (chỉ xuất hiện nếu chưa lưu trong localStorage).
   - Hiển thị 3 nút bấm lớn: "Chủ quán", "Nhân viên 1", "Nhân viên 2". Chạm là vào ngay trang chủ, không cần mật khẩu (Honor System).
2. **Trang Chủ (Home - `/`)**: Dành riêng cho thao tác Nhập liệu.
   - Nút nhỏ ở góc để "Đổi người nhập".
   - Thẻ hiển thị **Tổng chi phí hôm nay** (dành trọn sự chú ý).
   - Form **Nhập Nhanh** (Autocomplete tên hàng, NCC, Nhập số tiền).
   - Nút Xem danh sách đầy đủ.
3. **Danh Sách (History - `/danh-sach`)**: Quản lý lịch sử và đính chính.
   - Lọc theo khoảng ngày, tìm kiếm.
   - Danh sách phiếu nhập cuộn vô tận (Infinite scroll). Tên người nhập hiển thị mờ bên dưới món hàng.
   - Thao tác: Bấm vào phiếu để **Đính chính**.

## Voice and Tone

- **Ngắn gọn, dứt khoát**: Không rườm rà. (Ví dụ: "Đã lưu phiếu" thay vì "Hệ thống đã lưu phiếu nhập của bạn thành công").
- **Tập trung vào hành động**: Label của input phải là các danh từ trực tiếp (Tên hàng hóa, Số tiền, Ghi chú) thay vì câu hỏi (Bạn mua gì hôm nay?).
- **Cảm giác an toàn**: Lỗi sai có thể sửa. Thông báo lỗi phải hướng dẫn cách sửa ngay lập tức.

## Component Patterns (Behavioral)

- **Autocomplete Input**:
  - Gõ ≥ 2 ký tự: Tự động filter lịch sử (debounce 300ms) thả xuống dropdown gợi ý (tối đa 5 mục).
  - Tap ra ngoài: Đóng dropdown.
  - Chọn gợi ý: Tự điền vào input và focus ngay xuống trường tiếp theo.
- **Correction Entry (Form Đính chính)**:
  - Khi bấm vào 1 phiếu cũ, form hiển thị dữ liệu cũ đã được điền sẵn.
  - Khi lưu, giao diện hiển thị (Optimistic UI) dòng cũ bị gạch mờ, dòng mới nổi lên. (Backend sẽ ghi Append-only ngầm).
- **Sticky CTA (Nút Lưu)**:
  - Trên mobile, khi cuộn form, nút "Lưu phiếu" luân chuyển thành sticky bottom, đảm bảo ngón cái luôn chạm tới được bất kể form dài bao nhiêu.

## State Patterns

- **Loading (Mặc định)**: Không sử dụng full-page spinner. Dùng skeleton loading cho Danh sách. Đối với thao tác Lưu: sử dụng Optimistic UI, xóa trắng form ngay lập tức và hiện Snackbar báo "Đang lưu...", nếu lỗi sẽ rollback và hiện thông báo lỗi.
- **Empty States**: Khi chưa có phiếu nhập nào, hiển thị một câu text mờ `meta`: "Chưa có chi phí nào hôm nay. Bắt đầu nhập ở form bên dưới." Không cần hình minh họa cầu kỳ tốn diện tích.
- **Error States**: Viền input chuyển sang trạng thái cảnh báo nhẹ, hiển thị text đỏ ngay dưới trường nhập liệu. 

## Key Flows

### UJ-1: Mua hàng tại chợ (Nhập siêu tốc)
- **Protagonist**: Nhân viên A, một tay xách đồ, một tay cầm điện thoại.
- **Path**: 
  1. Mở app. Lần đầu: Bấm nút tên "Nhân viên A". Các lần sau tự động vào form. Focus tự động đặt ở "Tên hàng".
  2. Gõ "đườn" -> Autocomplete thả xuống "Đường cát đen". Chạm vào chọn.
  3. Bấm ô Số lượng, gõ "5", chọn "kg".
  4. Bấm ô Tiền, gõ "100000".
  5. Vuốt nhẹ xuống, bấm nút "Lưu" to đùng.
- **Climax**: Form trống trơn ngay lập tức, Sổ tổng chi phí hôm nay nảy nhẹ và tăng thêm 100k. Một snackbar hiện ra dưới cùng: "Đã lưu phiếu." (hệ thống âm thầm lưu tên "Nhân viên A" vào phiếu). Mọi thứ diễn ra trong 15 giây.

### UJ-2: Khắc phục lỗi sai (Phiếu đính chính ngầm)
- **Protagonist**: Tối về, anh Admin soát lại thấy lúc sáng Nhân viên A nhập sai 100k đường thành 10k.
- **Path**:
  1. Vào tab Danh sách. Thấy dòng "Đường cát đen - 10.000đ" (Người nhập: Nhân viên A).
  2. Chạm vào dòng đó. Form Đính chính hiện lên, các số liệu giữ nguyên.
  3. Anh Admin xóa số 10000, gõ 100000. Bấm "Cập nhật".
- **Climax**: Dòng "Đường cát đen - 10.000đ" trong danh sách mờ đi nhẹ nhàng, bị gạch ngang. Một dòng mới xuất hiện ngay dưới "Đường cát đen - 100.000đ" với nhãn "Đã đính chính bởi Admin". Tên nhân viên A vẫn được lưu giữ trong phiếu sai gốc để truy vết. Tổng chi cập nhật. Anh yên tâm vì dữ liệu minh bạch.
