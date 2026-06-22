---
status: final
updated: 2026-06-22
colors:
  surface-base: '#FFFFFF'
  surface-raised: '#F7F9F8'
  ink-primary: '#1A2F25'
  ink-secondary: '#5C7368'
  ink-disabled: '#A6B5AD'
  accent: '#208C5D'
  accent-hover: '#186A46'
  border-hairline: '#E5EBE8'
  surface-base-dark: '#0D1411'
  surface-raised-dark: '#16201B'
  ink-primary-dark: '#E8F0EC'
  ink-secondary-dark: '#9CB0A5'
  ink-disabled-dark: '#4D6157'
  accent-dark: '#2CB379'
  border-hairline-dark: '#24332B'
typography:
  title:
    note: 'Platform native — iOS Title 1 · Android Headline Small'
  body:
    note: 'Platform native — iOS Body · Android Body Large'
  meta:
    note: 'Platform native — iOS Footnote · Android Body Small'
  number-display:
    note: 'Monospaced digits for expense totals to ensure scannability'
rounded:
  sm: 8px
  md: 16px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
---

# Design Specification: Nhập Liệu Quán Cafe

## Brand & Style

Ứng dụng là một công cụ nhập liệu siêu tốc cho chủ quán cafe. Nó không phải là một dashboard tài chính phức tạp, mà là một cuốn "sổ tay điện tử" thông minh. Phong cách thiết kế hướng tới sự **tinh giản, hiện đại và tập trung hoàn toàn vào dữ liệu**. Tone màu chủ đạo là xanh lá (Green tone) mang lại cảm giác thân thiện, tươi mát, gợi liên tưởng đến quán cafe (thiên nhiên, mộc mạc) nhưng vẫn giữ được sự chuyên nghiệp của một công cụ quản lý tài chính.

## Colors

Bảng màu được thiết kế để không gây xao nhãng. Mọi thứ trên màn hình đều nhường chỗ cho form nhập liệu và con số tổng.

- **White/Dark Green (`#FFFFFF` / `#0D1411`)** là nền tảng canvas chính. Cực kỳ sạch sẽ.
- **Ink Primary (`#1A2F25`)** là màu chữ chính, hơi pha chút sắc xanh lá sẫm thay vì đen tuyền (`#000000`) để tạo sự hài hòa với toàn bộ hệ thống.
- **Emerald Green (`#208C5D` light / `#2CB379` dark)** là màu Accent duy nhất. Nó được dùng cho các nút CTA chính (như nút "Lưu") và các con số tổng chi phí quan trọng. Không lạm dụng màu này cho các thành phần trang trí không có tính tương tác.
- **Hairline (`#E5EBE8`)** để phân cách các dòng dữ liệu với độ tương phản thấp nhất có thể.

## Typography

Sử dụng font hệ thống (San Francisco trên iOS, Roboto trên Android) để đảm bảo tốc độ tải trang cực nhanh và cảm giác thân thuộc cho người dùng. 

Riêng đối với các con số (Tổng chi, Số tiền trong phiếu nhập), cần sử dụng thuộc tính `tabular-nums` (monospaced digits) để các con số thẳng hàng khi người dùng scan danh sách chi tiêu.

## Layout & Spacing

Mobile-first tuyệt đối (375px). 
Tất cả các màn hình đều là **Single-column**. Không có thanh điều hướng bên (sidebar).
Khoảng cách lề chuẩn (Margin) là `16px`. Các thẻ (Card) cách nhau `16px`. Các trường (Input fields) trong form cách nhau `12px` để gom nhóm các thông tin liên quan.

## Elevation & Depth

Giao diện hoàn toàn **Phẳng (Flat)**. Không sử dụng drop-shadows để tạo phân cấp. Phân cấp thông tin được thể hiện qua kích thước chữ và độ đậm nhạt của màu nền (sự khác biệt giữa `surface-base` và `surface-raised`).

## Shapes

`rounded/sm` (8px) cho các ô nhập liệu (Input/Dropdown).
`rounded/md` (16px) cho các block thông tin lớn (Card chứa tổng chi, Bottom Sheet).
Không sử dụng các góc bo tròn tuyệt đối (pill shape) ngoại trừ các icon nút bấm nhỏ.

## Components

- **Summary Card**: Khối hiển thị Tổng chi hôm nay. Đặt ở đầu trang, trên nền `surface-raised`, số tiền to, rõ, font đậm, sử dụng màu `accent`.
- **Quick Entry Form**: Form trải dài một cột. Các input field to rõ, dễ chạm (Touch target tối thiểu 48px). Không có viền đậm (border đậm), chỉ dùng `border-hairline` và đổi màu viền sang `accent` khi focus.
- **Snackbar (Toast)**: Xuất hiện ở góc dưới màn hình sau khi lưu phiếu. Màu nền `ink-primary`, chữ trắng. Tự động ẩn sau 3 giây.
- **Entry Row**: Một dòng trong danh sách lịch sử. Tên mặt hàng chữ đậm, ngày tháng chữ nhạt (`meta`), số tiền canh lề phải để dễ so sánh.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Sử dụng màu xanh lá (Accent) làm điểm nhấn cho các số tiền lớn và nút Lưu. | Dùng màu đỏ, cam, vàng để phân loại chi phí (gây rối mắt). |
| Thiết kế input to, Touch target > 48px để bấm bằng một tay. | Nhồi nhét 2 input trên cùng một hàng ngang trên mobile. |
| Dùng `useOptimistic` để dọn form ngay lập tức khi bấm Lưu. | Bắt người dùng nhìn vòng tròn xoay (Loading spinner) mỗi lần nhập xong. |
| Hiển thị snackbar "Đã lưu" thanh lịch ở dưới cùng. | Bật Popup Dialog bắt xác nhận "Bạn có chắc muốn lưu?". |
