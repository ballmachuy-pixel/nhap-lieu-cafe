---
stepsCompleted: [1]
inputDocuments: [
  "c:/Users/Admin/Desktop/nhập liệu/_bmad-output/planning-artifacts/prds/prd-nhập liệu-2026-06-21/prd.md",
  "c:/Users/Admin/Desktop/nhập liệu/_bmad-output/planning-artifacts/architecture.md",
  "c:/Users/Admin/Desktop/nhập liệu/_bmad-output/planning-artifacts/ux-designs/ux-nhập liệu-2026-06-22/DESIGN.md",
  "c:/Users/Admin/Desktop/nhập liệu/_bmad-output/planning-artifacts/ux-designs/ux-nhập liệu-2026-06-22/EXPERIENCE.md"
]
---

# Nhập Liệu Quán Cafe - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Nhập Liệu Quán Cafe, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: Ngày mua mặc định hôm nay, có thể sửa sang ngày khác (tối đa 30 ngày quá khứ, không chọn tương lai).
FR-2: Autocomplete tên hàng hóa khi gõ ≥1 ký tự, không phân biệt dấu, tự động lưu tên mới.
FR-3: Nhập số lượng (số thập phân) và chọn đơn vị từ dropdown (kg, lít, cái... hoặc Khác).
FR-4: Autocomplete nhà cung cấp tương tự FR-2. Có thể bỏ trống.
FR-5: Nhập số tiền (VNĐ) nguyên dương, format có dấu phân cách. Bắt buộc nhập.
FR-6: Chọn hình thức thanh toán (Tiền mặt/Chuyển khoản). Mặc định Tiền mặt.
FR-7: Thêm ghi chú tùy chọn (tối đa 500 ký tự).
FR-8: Lưu phiếu nhập (Audit Trail). Hệ thống tự đính kèm `created_by` dựa trên Honor System, reset form, hiện snackbar.
FR-9: Xem danh sách phiếu nhập với infinite scroll (20 items/page), sắp xếp mới nhất.
FR-10: Lọc danh sách phiếu nhập theo khoảng ngày (preset: Hôm nay, Tuần này, Tháng này).
FR-11: Tìm kiếm phiếu nhập theo tên hàng hóa / NCC (không phân biệt dấu, debounce 300ms).
FR-12: Sửa lỗi phiếu nhập (Tạo Phiếu Đính Chính). Form đính chính sinh phiếu gạch ngang dòng cũ, bù trừ ngầm theo Append-only, lưu `corrected_by`.
FR-14: Hiển thị Tổng chi hôm nay trên màn hình chính (visible mặc định).
FR-15: Hiển thị Tổng chi tuần hiện tại, so sánh % với tuần trước.
FR-16: Hiển thị Tổng chi tháng hiện tại, có dropdown chọn tháng khác.
FR-19: Lưu trữ server-side, response time < 500ms.
FR-20: Truy cập đa thiết bị không cần đăng nhập. Cân bằng bảo mật bằng cơ chế Honor System.

### NonFunctional Requirements

NFR-1: Page load < 3 giây trên mạng 4G. Autocomplete response < 200ms.
NFR-2: Mobile-first responsive layout (chính 375px), hỗ trợ desktop (1024px).
NFR-3: Hỗ trợ tối thiểu 10.000 phiếu nhập (~18 tháng) không suy giảm hiệu năng.
NFR-4: Browser support: Chrome, Safari. Không cần IE/Firefox.
NFR-5: Uptime ≥ 99% trên Vercel.
NFR-6: Không sử dụng DELETE hoặc UPDATE (Append-only) để đảm bảo Tamper-proof Data Protection.

### Additional Requirements

- **Starter Template**: Next.js App Router (Standard Starter) với TypeScript và Tailwind CSS. Sử dụng Vercel Hosting.
- Architecture Constraint: Sử dụng Supabase PostgreSQL (có bật extension `unaccent` để tìm kiếm tiếng Việt).
- Communication Pattern: Mọi logic cập nhật CSDL phải nằm trong Server Actions ở thư mục `src/actions/`. Không tự tạo API routes riêng.
- Honor System Identity: Danh tính lấy từ `localStorage` và chuyển vào payload của Server Actions. Không dùng bảng `users`.

### UX Design Requirements

UX-DR1: Khởi tạo Design Tokens (Màu Xanh lá tinh giản, `surface-base`, `surface-raised`, `ink-primary`, `accent`).
UX-DR2: Sử dụng font tabular-nums (monospace) cho các con số tiền bạc. Thiết kế toàn bộ giao diện Flat (không đổ bóng), corner-radius 8px-16px.
UX-DR3: Cấu hình màn hình Định Danh (Identity Screen). 3 nút chọn "Chủ quán", "Nhân viên 1", "Nhân viên 2", lưu vào localStorage. 
UX-DR4: Thiết kế Quick Entry Form với các input to (touch target >48px), đường viền `hairline`, focus đổi màu `accent`.
UX-DR5: Áp dụng Optimistic UI cho thao tác Lưu: Xóa sạch form ngay lập tức và hiển thị Snackbar góc dưới màn hình.
UX-DR6: Thiết kế trải nghiệm Phiếu đính chính: Dòng cũ bị gạch mờ, dòng mới hiển thị nhãn "Đã đính chính bởi [Tên]".

### FR Coverage Map

FR-1: Epic 2 - Form nhập (Mặc định ngày hôm nay)
FR-2: Epic 2 - Form nhập (Autocomplete Tên hàng hóa)
FR-3: Epic 2 - Form nhập (Số lượng & Đơn vị)
FR-4: Epic 2 - Form nhập (Autocomplete NCC)
FR-5: Epic 2 - Form nhập (Số tiền VNĐ)
FR-6: Epic 2 - Form nhập (Hình thức thanh toán)
FR-7: Epic 2 - Form nhập (Ghi chú)
FR-8: Epic 2 - Form nhập (Lưu phiếu & Audit Trail)
FR-9: Epic 3 - Quản lý Lịch sử (Danh sách vô tận)
FR-10: Epic 3 - Quản lý Lịch sử (Lọc theo khoảng ngày)
FR-11: Epic 3 - Quản lý Lịch sử (Tìm kiếm)
FR-12: Epic 3 - Quản lý Lịch sử (Phiếu Đính Chính)
FR-14: Epic 4 - Báo cáo (Tổng chi hôm nay)
FR-15: Epic 4 - Báo cáo (Tổng chi tuần)
FR-16: Epic 4 - Báo cáo (Tổng chi tháng)
FR-19: Epic 1 - Truy cập cơ sở (Lưu trữ Cloud siêu tốc)
FR-20: Epic 1 - Truy cập cơ sở (Định danh Honor System đa thiết bị)

## Epic List

### Epic 1: Nền tảng & Truy cập Đa thiết bị
**Goal:** Người dùng (Chủ quán và Nhân viên) có thể truy cập ứng dụng mượt mà từ mọi thiết bị, chọn định danh của mình cực nhanh qua "Honor System" để bắt đầu phiên làm việc. Epic này cũng đặt nền móng kiến trúc CSDL Append-only và các Design Token (Xanh lá tinh giản).
**FRs covered:** FR-19, FR-20

### Epic 2: Nhập Liệu Siêu Tốc (Quick Entry)
**Goal:** Nhân viên đang đi chợ có thể ghi nhận khoản chi chỉ trong dưới 30s nhờ form nhập thông minh (tự gợi ý tên hàng, lưu dấu vết người nhập) và xóa trắng form ngay lập tức (Optimistic UI) để sẵn sàng nhập món tiếp theo.
**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-7, FR-8

### Epic 3: Tra Cứu & Đính Chính Minh Bạch
**Goal:** Chủ quán có thể lướt xem lịch sử chi tiêu, tìm lại giao dịch cũ, và sửa lỗi sai bằng cách tạo phiếu đính chính (dòng cũ bị gạch mờ, lưu vết người sửa) để đảm bảo tính minh bạch tuyệt đối mà không cần xóa dữ liệu.
**FRs covered:** FR-9, FR-10, FR-11, FR-12

### Epic 4: Báo cáo Tổng Chi Theo Khung Thời Gian
**Goal:** Chủ quán lập tức biết được tình hình "đốt tiền" của quán thông qua các thẻ tổng chi Ngày/Tuần/Tháng ngay trên màn hình mà không cần phải tự cộng sổ.
**FRs covered:** FR-14, FR-15, FR-16

## Epic 1: Nền tảng & Truy cập Đa thiết bị

Người dùng (Chủ quán và Nhân viên) có thể truy cập ứng dụng mượt mà từ mọi thiết bị, chọn định danh của mình cực nhanh qua "Honor System" để bắt đầu phiên làm việc. Epic này cũng đặt nền móng kiến trúc CSDL Append-only và các Design Token.

### Story 1.1: Khởi tạo Project & Design System

As a Developer,
I want khởi tạo Next.js App Router và cấu hình Tailwind CSS Design Tokens (màu Xanh lá tinh giản, font tabular-nums),
So that toàn bộ app có giao diện đồng nhất theo đúng bản thiết kế ngay từ đầu.

**Acceptance Criteria:**

**Given** một repository trống
**When** developer chạy init Next.js và cài đặt các biến màu sắc/font/spacing vào `tailwind.config.ts`
**Then** hệ thống có thể render các thẻ `div` test với màu `bg-surface-base` và `text-ink-primary` chuẩn xác
**And** font chữ cho số được hiển thị dưới dạng tabular-nums (các chữ số thẳng hàng)

### Story 1.2: Thiết lập Database Supabase & Append-only Schema

As a System Architect,
I want tạo bảng `entries` trên Supabase với RLS chặn Update/Delete và bật `unaccent`,
So that CSDL sẵn sàng lưu trữ phiếu nhập theo đúng nguyên tắc bảo vệ dữ liệu chống xóa sửa (Tamper-proof).

**Acceptance Criteria:**

**Given** môi trường Supabase project mới
**When** chạy file SQL migration khởi tạo schema
**Then** bảng `entries` được tạo với các cột cần thiết (date, item_name, quantity, unit, vendor, amount, method, note, created_by, corrected_by, correction_for_id)
**And** Row Level Security (RLS) policies chỉ cho phép `INSERT` và `SELECT`, chặn hoàn toàn `UPDATE` và `DELETE`
**And** extension `unaccent` được kích hoạt phục vụ tìm kiếm

### Story 1.3: Màn hình Định Danh (Identity Login - Honor System)

As a Người dùng (Chủ/Nhân viên),
I want chạm vào tên mình trên màn hình thay vì gõ mật khẩu,
So that tôi có thể truy cập hệ thống ngay lập tức mà hệ thống vẫn lưu lại được dấu vết (ai nhập phiếu nào).

**Acceptance Criteria:**

**Given** người dùng lần đầu mở app (chưa có dữ liệu `localStorage`)
**When** họ truy cập URL bất kỳ
**Then** họ bị đẩy về trang `/login` hiển thị 3 nút bấm lớn: "Chủ quán", "Nhân viên 1", "Nhân viên 2"
**And** Khi bấm chọn, hệ thống lưu định danh vào `localStorage` và chuyển hướng vào `/` (Trang chủ)
**And** Lần mở app sau (đã có `localStorage`), họ vào thẳng Trang chủ không cần hỏi lại.

## Epic 2: Nhập Liệu Siêu Tốc (Quick Entry)

Nhân viên đang đi chợ có thể ghi nhận khoản chi chỉ trong dưới 30s nhờ form nhập thông minh (tự gợi ý tên hàng, lưu dấu vết người nhập) và xóa trắng form ngay lập tức (Optimistic UI) để sẵn sàng nhập món tiếp theo.

### Story 2.1: Giao diện Form Nhập Nhanh (Quick Entry UI)

As a Người dùng,
I want nhìn thấy một form nhập liệu với các ô nhập lớn, dễ bấm và ngày tháng mặc định là hôm nay,
So that tôi không bị bấm nhầm khi đang cầm đồ ở chợ và bớt được thao tác chọn ngày.

**Acceptance Criteria:**

**Given** người dùng truy cập Trang chủ (`/`)
**When** form nhập liệu được hiển thị
**Then** giao diện tuân thủ Mobile-first với các input box có touch-target lớn (>48px)
**And** trường Số lượng và Số tiền phải ép bật bàn phím số lập tức trên điện thoại (`inputmode="numeric"`)
**And** trường Ngày tự động điền ngày hiện tại theo giờ Việt Nam
**And** danh sách Đơn vị xổ xuống có 10 loại phổ biến và một mục "Khác" (hiển thị ô nhập text khi chọn)

### Story 2.2: Tính năng Autocomplete Tên Hàng & NCC

As a Người dùng,
I want hệ thống gợi ý tên món hàng và tên nhà cung cấp khi tôi mới gõ vài chữ, kèm theo mức giá cũ,
So that tôi không phải gõ tay toàn bộ tên và không cần gõ lại số tiền nếu mua với giá không đổi.

**Acceptance Criteria:**

**Given** người dùng đang điền trường Tên hàng hoặc Nhà Cung Cấp
**When** họ gõ từ 1 ký tự trở lên (vd: "ca")
**Then** hệ thống query danh sách các item cũ (không phân biệt dấu tiếng Việt) và hiển thị dropdown gợi ý (tối đa 5 mục)
**And** khi người dùng chạm để chọn một món hàng đã từng mua, hệ thống tự động điền luôn Đơn vị và Số tiền của lần mua gần nhất vào các ô tương ứng.
**And** người dùng có quyền để nguyên mức giá đó hoặc gõ lại giá mới.

### Story 2.3: Xử lý Lưu Phiếu & Trải nghiệm Optimistic UI

As a Người dùng,
I want ứng dụng lưu ngay lập tức, xóa trắng form và báo thành công ở góc màn hình,
So that tôi biết tiền đã được ghi sổ và có thể gõ ngay món hàng tiếp theo.

**Acceptance Criteria:**

**Given** người dùng đã điền đủ thông tin bắt buộc (Số tiền, Tên hàng)
**When** bấm nút "Lưu" to đùng ở dưới cùng
**Then** hệ thống gọi Server Action lưu vào bảng `entries`, tự động nhúng `created_by` từ `localStorage`
**And** ngay lập tức, form được reset trống trơn (ngoại trừ trường Ngày) để nhập món khác
**And** hiện Snackbar "Đã lưu phiếu" ở góc dưới màn hình.

## Epic 3: Tra Cứu & Đính Chính Minh Bạch

Chủ quán có thể lướt xem lịch sử chi tiêu, tìm lại giao dịch cũ, và sửa lỗi sai bằng cách tạo phiếu đính chính (dòng cũ bị gạch mờ, lưu vết người sửa) để đảm bảo tính minh bạch tuyệt đối mà không cần xóa dữ liệu.

### Story 3.1: Danh sách phiếu nhập (History & Infinite Scroll)

As a Chủ quán,
I want xem danh sách cuộn vô tận các khoản đã chi, hiển thị rõ ràng số tiền và tên nhân viên nhập,
So that tôi có thể lướt kiểm tra sổ sách một cách dễ dàng như lướt mạng xã hội.

**Acceptance Criteria:**

**Given** người dùng truy cập tab Danh Sách (`/danh-sach`)
**When** dữ liệu được tải
**Then** danh sách hiển thị các phiếu nhập theo thứ tự mới nhất trước
**And** tải 20 phiếu mỗi lần, tự động gọi API tải thêm 20 phiếu tiếp theo khi cuộn xuống gần đáy trang

### Story 3.2: Lọc & Tìm kiếm thông minh

As a Chủ quán,
I want gõ tìm tên món hàng hoặc lọc nhanh theo "Tuần này", "Tháng này",
So that tôi tìm lại khoản chi nhanh chóng mà không phải cuộn mỏi tay.

**Acceptance Criteria:**

**Given** người dùng ở trang Danh Sách
**When** gõ vào thanh tìm kiếm hoặc chọn preset Lọc
**Then** danh sách tự động cập nhật sau 300ms (debounce) nếu gõ text
**And** nút Lọc nhanh có sẵn: "Hôm nay", "Tuần này", "Tháng này" để chuyển ngày lập tức

### Story 3.3: Form Sửa Lỗi (Cơ chế Đính chính ngầm - Append Only)

As a Chủ quán,
I want chạm vào một phiếu sai và sửa lại số tiền,
So that dữ liệu được sửa đúng mà hệ thống vẫn lưu vết minh bạch (ai là người sửa).

**Acceptance Criteria:**

**Given** người dùng bấm vào một phiếu nhập sai
**When** form Đính chính hiện ra và họ bấm "Cập nhật" giá trị mới
**Then** Server Action chèn một bản ghi mới (phiếu đúng) và đánh dấu `correction_for_id` tới bản ghi cũ, KHÔNG thực hiện UPDATE
**And** trên UI, dòng cũ lập tức bị gạch ngang mờ đi, dòng mới hiện ra ngay bên dưới kèm nhãn "Đã đính chính bởi [Tên]"

### Epic 4: Báo cáo Tổng Chi Theo Khung Thời Gian

Chủ quán lập tức biết được tình hình "đốt tiền" của quán thông qua các thẻ tổng chi Ngày/Tuần/Tháng ngay trên màn hình mà không cần phải tự cộng sổ.

### Story 4.1: Thẻ Báo Cáo "Tổng chi hôm nay"

As a Chủ quán,
I want nhìn thấy Tổng số tiền đã chi hôm nay ngay trên cùng màn hình Trang chủ,
So that tôi biết ngay ví mình đã vơi đi bao nhiêu mà không cần bấm vào xem chi tiết.

**Acceptance Criteria:**

**Given** người dùng ở màn hình Nhập Liệu (`/`)
**When** dữ liệu được tải hoặc vừa lưu xong phiếu mới
**Then** thẻ "Tổng chi hôm nay" hiển thị con số VNĐ chuẩn xác
**And** hệ thống tính toán dựa trên tổng các phiếu nhập hợp lệ trong ngày (kể cả bù trừ đính chính âm dương)

### Story 4.2: Báo cáo Tổng chi Tuần & Tháng

As a Chủ quán,
I want xem tổng chi của cả Tuần này và Tháng này,
So that tôi có góc nhìn rộng hơn để biết tuần này có đang xài lố so với tuần trước không.

**Acceptance Criteria:**

**Given** người dùng xem bảng Báo Cáo
**When** dữ liệu hiển thị
**Then** hiển thị tổng chi Tuần này, kèm % tăng giảm so với Tuần trước
**And** hiển thị tổng chi Tháng này, cho phép chọn Dropdown đổi tháng để xem lại lịch sử
