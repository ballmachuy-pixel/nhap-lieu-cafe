---
title: "Product Brief: Nhập Liệu Quán Cafe"
status: final
created: 2026-06-21
updated: 2026-06-21
---

# Product Brief: Nhập Liệu Quán Cafe

## Tóm tắt

Một tool web nội bộ giúp chủ quán cafe ghi lại toàn bộ chi phí mua hàng hàng ngày — từ nguyên vật liệu pha chế, cây cảnh, đến mọi khoản chi vận hành. Tool tối ưu cho điện thoại để nhập nhanh ngay tại quán hoặc ngoài chợ, đồng thời dùng được trên máy tính. Không cần đăng nhập, mở ra là dùng luôn. Dữ liệu đồng bộ giữa các thiết bị.

Mục tiêu duy nhất: **biết đã chi bao nhiêu tiền** — theo ngày, tuần, tháng — và xuất được ra Excel để gửi kế toán khi cần.

## Vấn đề

Quán cafe hiện tại **không có công cụ nào** để theo dõi chi phí mua hàng. Mỗi ngày chủ quán mua đủ thứ — cà phê, sữa, đường, cây cảnh, vật dụng vận hành — nhưng không có chỗ ghi lại tập trung. Kết quả:

- Không biết chính xác tháng này đã chi bao nhiêu
- Khó đối chiếu với kế toán
- Khi mở thêm chi nhánh, việc theo dõi sẽ càng khó hơn
- Mất thời gian nhớ lại hoặc tìm kiếm hóa đơn cũ

## Giải pháp

Một web app đơn giản, mobile-first, cho phép chủ quán:

1. **Nhập nhanh mỗi lần mua hàng** với đầy đủ thông tin:
   - Ngày mua (mặc định là hôm nay, cho phép sửa)
   - Tên hàng hóa (có gợi ý từ lịch sử nhập — autocomplete)
   - Số lượng + đơn vị (chọn từ danh sách có sẵn: kg, lít, cái, bó, hộp, gói, bịch, thùng, chai + "Khác")
   - Nhà cung cấp (gõ tay, có gợi ý từ lịch sử nhập — autocomplete)
   - Số tiền (VNĐ)
   - Hình thức thanh toán (tiền mặt / chuyển khoản)
   - Ghi chú (tùy chọn — ví dụ: "trả chậm chưa TT", "bị ẩm trả lại 500g")

2. **Xem lại danh sách phiếu nhập** — lọc theo ngày, tìm kiếm theo tên hàng hoặc nhà cung cấp

3. **Xem tổng chi phí** theo ngày / tuần / tháng

4. **Xuất dữ liệu ra Excel** với cấu trúc rõ ràng:
   - Các cột: Ngày mua, Tên hàng, Số lượng, Đơn vị, Nhà cung cấp, Số tiền, Hình thức TT, Ghi chú
   - Có dòng tổng cộng
   - Lọc theo khoảng thời gian trước khi xuất (tuần / tháng / tùy chọn)

5. **Sửa / xóa phiếu nhập** — xóa có cơ chế hoàn tác (undo) để tránh mất dữ liệu nhầm

## Ai sẽ dùng

**Người dùng chính: chủ quán (Admin)**

- Tự nhập liệu cho tất cả chi nhánh
- Nhập chủ yếu bằng điện thoại, ngay khi mua hàng hoặc cuối ngày
- Đôi khi dùng máy tính để xem lại hoặc xuất Excel
- Không cần chia quyền, không cần tài khoản nhân viên

**Stakeholder ngầm: kế toán**

- Nhận file Excel từ chủ quán
- Cần dữ liệu đầy đủ, nhất quán, dễ đọc để đối chiếu

## Yêu cầu quan trọng

- **Dữ liệu phải truy cập được từ nhiều thiết bị** — nhập trên điện thoại, xem trên máy tính, không mất dữ liệu khi đổi thiết bị hay xóa cache. Đây là yêu cầu nghiệp vụ, cách triển khai kỹ thuật do kiến trúc sư quyết định.
- **Nhập nhanh** — autocomplete tên hàng + nhà cung cấp từ lịch sử, đơn vị chọn từ dropdown, ngày mua mặc định hôm nay. Mọi thiết kế hướng đến mục tiêu dưới 30 giây/phiếu.
- **Bảo vệ dữ liệu** — xóa phiếu có cơ chế hoàn tác (undo snackbar), không xóa vĩnh viễn ngay lập tức.

## Phạm vi phiên bản đầu (v1)

### Có trong v1

- Form nhập liệu tối ưu cho mobile (ít thao tác, nhập nhanh)
- Autocomplete tên hàng + nhà cung cấp từ lịch sử nhập
- Đơn vị chọn từ dropdown (không gõ tay)
- Ngày mua mặc định hôm nay
- Trường ghi chú tùy chọn
- Danh sách phiếu nhập: xem, sửa, xóa (có undo)
- Lọc/tìm kiếm theo ngày, tên hàng, nhà cung cấp
- Tổng hợp chi phí theo ngày / tuần / tháng
- Xuất Excel với cấu trúc rõ ràng + dòng tổng + filter thời gian
- Hỗ trợ 1 chi nhánh
- Không cần đăng nhập
- Dữ liệu đồng bộ đa thiết bị (backend)

### Không có trong v1

- Quản lý doanh thu / tính lãi lỗ
- Phân loại chi phí theo danh mục
- Quản lý tồn kho / cảnh báo hết hàng
- Đính kèm ảnh hóa đơn
- Hệ thống đăng nhập / phân quyền
- Hỗ trợ nhiều chi nhánh
- Danh sách nhà cung cấp có quản lý (CRUD)
- Hoạt động offline (xem Known Risks)

### Known Risks

- **Offline**: Chủ quán đi chợ, sóng yếu, muốn nhập ngay — web app cần internet. Nếu offline, việc nhập sẽ phải chờ. Cân nhắc giải pháp offline nhẹ (service worker / queue) trong tương lai.
- **Dữ liệu nhà cung cấp không chuẩn hóa**: Gõ tay tự do dẫn đến cùng NCC có nhiều cách viết. Autocomplete giảm thiểu nhưng không loại bỏ hoàn toàn. Chấp nhận ở v1, cải thiện ở v2 với danh sách NCC.

## Tiêu chí thành công

- Chủ quán nhập được một phiếu mua hàng trong **dưới 30 giây** trên điện thoại
- Xem được tổng chi tháng này chỉ với **1 thao tác**
- Xuất Excel thành công: dữ liệu đúng, đủ, đúng cấu trúc, kế toán đọc được ngay
- Sau 1 tuần sử dụng, chủ quán tự nhập **ít nhất 80%** các lần mua hàng vào tool thay vì bỏ qua

## Tầm nhìn

Khi quán mở thêm chi nhánh, tool sẽ phát triển thêm:

- Hỗ trợ nhiều chi nhánh, mỗi chi nhánh có dữ liệu riêng
- Danh sách nhà cung cấp lưu sẵn để chọn nhanh (quản lý CRUD)
- Phân loại chi phí (nguyên liệu, vận hành, trang trí...)
- So sánh chi phí giữa các chi nhánh, giữa các tháng
- Hỗ trợ offline (service worker + sync khi có mạng)
- Có thể mở rộng thêm quản lý doanh thu nếu cần

Nhưng v1 chỉ cần một thứ: **nhập nhanh, xem tổng, xuất Excel**. Đơn giản là sức mạnh.
