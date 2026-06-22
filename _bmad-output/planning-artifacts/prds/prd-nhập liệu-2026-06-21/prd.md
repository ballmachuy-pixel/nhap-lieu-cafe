---
title: "PRD: Nhập Liệu Quán Cafe"
status: final
created: 2026-06-21
updated: 2026-06-22
---

# PRD: Nhập Liệu Quán Cafe

## 0. Mục đích tài liệu

PRD này dành cho chủ quán (Admin), kiến trúc sư hệ thống, developer, và UX designer — những người sẽ thiết kế và xây dựng tool nhập liệu chi phí. Tài liệu sử dụng thuật ngữ chuẩn hóa tại §3 Glossary; các yêu cầu chức năng (FR) được đánh số toàn cục và gắn với User Journey (UJ) tương ứng. Giả định được gắn tag `[ASSUMPTION]` inline và tổng hợp tại §11.

Tài liệu xây dựng trên [Product Brief: Nhập Liệu Quán Cafe](./../briefs/brief-nhập liệu-2026-06-21/brief.md) đã được finalize ngày 2026-06-21.

## 1. Tầm nhìn

Nhập Liệu Quán Cafe là một web app nội bộ, tối ưu cho điện thoại, giúp chủ quán cafe ghi lại mọi khoản chi mua hàng — từ nguyên liệu pha chế, cây cảnh, đến vật dụng vận hành — ngay tại thời điểm mua hoặc cuối ngày.

Mục tiêu duy nhất và rõ ràng: **biết đã chi bao nhiêu tiền**. Không phân tích phức tạp, không quản lý tồn kho, không tính lãi lỗ. Chỉ cần nhập nhanh và xem tổng. Tool phải nhanh đến mức chủ quán sẵn lòng dùng nó thay vì bỏ qua — dưới 30 giây cho mỗi phiếu nhập trên điện thoại.

Dữ liệu đồng bộ giữa các thiết bị: nhập trên điện thoại ở chợ, xem lại trên máy tính ở quán. Không cần đăng nhập — mở ra là dùng luôn. Đơn giản là sức mạnh.

## 2. Người dùng mục tiêu

### 2.1 Jobs To Be Done

- **Functional:** Ghi lại mỗi lần mua hàng nhanh chóng để không quên, không mất dữ liệu, biết chính xác tổng chi phí.
- **Emotional:** Cảm thấy kiểm soát được tài chính quán — không lo lắng vì "không biết tiền đi đâu".
- **Contextual:** Cần nhập ngay khi vừa mua xong — đang ở chợ, đang ở quán, tay có thể đang bận — nên thao tác phải ít và nhanh.

### 2.2 Non-Users (v1)

- **Nhân viên quán** — Được phân quyền mềm (Honor System) để trực tiếp nhập liệu khi mua hàng. Không có hệ thống tài khoản / mật khẩu phức tạp.
- **Kế toán** — có hệ thống kế toán riêng, tool này chỉ phục vụ theo dõi chi phí nội bộ của quán.
- **Khách hàng** — tool hoàn toàn nội bộ, không public-facing.

### 2.3 Key User Journeys

**UJ-1. Anh Admin nhập phiếu mua hàng ngay tại chợ.**

- **Persona + context:** Anh Admin, chủ quán cafe, vừa mua xong 2kg cà phê bột ở chợ, đang cầm điện thoại.
- **Entry state:** Mở web app trên trình duyệt điện thoại. Không cần đăng nhập.
- **Path:** (1) Màn hình chính hiện form nhập — ngày mua đã mặc định hôm nay. (2) Gõ "cà" vào ô tên hàng → autocomplete gợi ý "Cà phê bột" từ lịch sử → chọn. (3) Nhập số lượng "2", chọn đơn vị "kg" từ dropdown. (4) Gõ "Lan" vào ô NCC → autocomplete gợi ý "Chị Lan — chợ Bà Chiểu" → chọn. (5) Nhập số tiền "350000". (6) Chọn "Tiền mặt". (7) Bấm Lưu.
- **Climax:** Snackbar xác nhận "Đã lưu phiếu nhập". Tổng chi hôm nay cập nhật ngay trên màn hình.
- **Resolution:** Anh Admin bỏ điện thoại vào túi, tiếp tục đi chợ mua thêm.
- **Edge case:** Nếu lỡ nhập sai số tiền, bấm "Đính chính" trên phiếu → nhập thẳng con số đúng (hệ thống tự động sinh phiếu bù trừ ngầm).

---

**UJ-2. Anh Admin kiểm tra chi tiêu tuần này.**

- **Persona + context:** Anh Admin, cuối tháng, ngồi soát lại sổ sách.
- **Entry state:** Mở web app trên điện thoại.
- **Path:** (1) Bấm vào tab "Danh sách". (2) Lướt xem các phiếu nhập gần đây. (3) Thấy các phiếu mua hàng có gắn tên nhân viên rõ ràng để đối soát. (4) Xem "Tổng chi tuần này" ở thẻ báo cáo.
- **Climax:** Số liệu khớp với số tiền đã giao cho nhân viên. Cảm thấy an tâm vì dấu vết kiểm toán (audit trail) minh bạch.
- **Resolution:** Tắt app. 

## 3. Glossary

Downstream workflows và readers phải dùng đúng các thuật ngữ dưới đây. FRs, UJs, và SMs dùng Glossary terms nguyên văn; dùng từ đồng nghĩa ở bất kỳ đâu trong PRD là vi phạm kỷ luật tài liệu.

- **Phiếu nhập** — Một bản ghi mua hàng, chứa đầy đủ thông tin: ngày mua, tên hàng hóa, số lượng, đơn vị, NCC, số tiền, hình thức thanh toán, ghi chú. Là đơn vị dữ liệu cơ bản của hệ thống. Một phiếu nhập ghi lại một lần mua.
- **Hàng hóa** — Tên sản phẩm / vật phẩm được mua (ví dụ: "Cà phê bột", "Sữa đặc", "Chậu cây"). Không phân loại theo danh mục trong v1.
- **Nhà cung cấp (NCC)** — Người hoặc đơn vị bán hàng. Nhập dạng text tự do với autocomplete từ lịch sử. Không có danh sách quản lý (CRUD) trong v1.
- **Đơn vị** — Đơn vị tính của hàng hóa. Chọn từ danh sách cố định: kg, lít, cái, bó, hộp, gói, bịch, thùng, chai, Khác.
- **Hình thức thanh toán** — Cách trả tiền cho lần mua hàng: Tiền mặt hoặc Chuyển khoản.
- **Tuần** — Chu kỳ 7 ngày từ Thứ Hai đến Chủ Nhật.
- **Phiếu đính chính (Correction Entry)** — Một bản ghi tự động được tạo ra ẩn dưới nền để bù trừ phần chênh lệch khi người dùng "sửa" một phiếu nhập sai, đảm bảo tính toàn vẹn dữ liệu (Append-only).
- **Honor System (Cơ chế tin tưởng)** — Người dùng chỉ cần chạm chọn tên mình trên màn hình để định danh mà không cần mật khẩu. Nhằm tối ưu tốc độ và áp dụng cho quy mô siêu nhỏ (chủ + 2 nhân viên).

## 4. Features

### 4.1 Nhập phiếu mua hàng (Quick Entry)

**Description:** Tính năng cốt lõi — form nhập phiếu mua hàng tối ưu cho mobile. Mọi thiết kế hướng đến mục tiêu hoàn thành một phiếu nhập trong dưới 30 giây: ngày mặc định hôm nay (bớt 1 bước), tên hàng hóa + NCC autocomplete từ lịch sử (bớt gõ), đơn vị chọn từ dropdown (không gõ tay). Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Ngày mua mặc định hôm nay

Chủ quán mở form nhập, trường ngày mua tự động điền ngày hiện tại. Chủ quán có thể sửa sang ngày khác nếu nhập bù.

**Consequences (testable):**

- Khi mở form mới, trường ngày mua hiển thị ngày hiện tại theo múi giờ Việt Nam (UTC+7).
- Chủ quán có thể chọn ngày khác qua date picker.
- `[ASSUMPTION: Cho phép chọn ngày trong quá khứ tối đa 30 ngày, không cho phép chọn ngày tương lai.]`

#### FR-2: Autocomplete tên hàng hóa

Chủ quán gõ tên hàng hóa, hệ thống gợi ý từ danh sách hàng hóa đã nhập trước đó. Realizes UJ-1.

**Consequences (testable):**

- Khi gõ ≥ 1 ký tự, dropdown gợi ý hiển thị các tên hàng hóa khớp (chứa chuỗi ký tự đã gõ). `[ASSUMPTION: Tìm kiếm không phân biệt dấu tiếng Việt — gõ "ca phe" khớp "Cà phê bột".]`
- Gợi ý sắp xếp theo tần suất sử dụng, ưu tiên gần đây (recency-weighted). `[ASSUMPTION]`
- Chủ quán có thể chọn gợi ý hoặc gõ tên mới hoàn toàn.
- Tên mới tự động thêm vào danh sách gợi ý cho lần sau.

#### FR-3: Số lượng và đơn vị

Chủ quán nhập số lượng (số) và chọn đơn vị từ dropdown cố định.

**Consequences (testable):**

- Số lượng chấp nhận số thập phân (ví dụ: 0.5, 1.5). `[ASSUMPTION]`
- Danh sách đơn vị: kg, lít, cái, bó, hộp, gói, bịch, thùng, chai, Khác.
- Khi chọn "Khác", hiển thị ô text để gõ đơn vị tùy chỉnh. `[ASSUMPTION]`
- Số lượng + đơn vị không bắt buộc — có thể bỏ trống nếu không áp dụng (ví dụ: mua dịch vụ). `[ASSUMPTION]`

#### FR-4: Autocomplete nhà cung cấp

Chủ quán gõ tên NCC, hệ thống gợi ý từ lịch sử. Realizes UJ-1.

**Consequences (testable):**

- Hành vi autocomplete tương tự FR-2 (gõ ≥ 1 ký tự → gợi ý → chọn hoặc gõ mới).
- Trường NCC không bắt buộc — có thể bỏ trống. `[ASSUMPTION]`

#### FR-5: Số tiền (VNĐ)

Chủ quán nhập số tiền đã trả cho lần mua.

**Consequences (testable):**

- Chỉ chấp nhận số nguyên dương (VNĐ không có đơn vị xu). `[ASSUMPTION]`
- Hiển thị format có dấu chấm phân cách hàng nghìn khi rời ô nhập (ví dụ: 350.000).
- Trường bắt buộc — không cho phép lưu phiếu nhập với số tiền = 0 hoặc rỗng.

#### FR-6: Hình thức thanh toán

Chủ quán chọn cách thanh toán cho lần mua.

**Consequences (testable):**

- Hai lựa chọn: Tiền mặt, Chuyển khoản.
- Mặc định: Tiền mặt. `[ASSUMPTION]`
- Bắt buộc chọn một trong hai.

#### FR-7: Ghi chú tùy chọn

Chủ quán có thể thêm ghi chú tự do cho phiếu nhập.

**Consequences (testable):**

- Trường text tự do, không bắt buộc.
- Giới hạn 500 ký tự. `[ASSUMPTION]`
- Ví dụ nội dung: "trả chậm chưa TT", "bị ẩm trả lại 500g".

#### FR-8: Lưu phiếu nhập (Audit Trail)

Chủ quán hoặc nhân viên lưu thông tin phiếu nhập vào hệ thống.

**Consequences (testable):**

- Bấm nút "Lưu phiếu" (trạng thái loading/optimistic UI hiển thị ngay).
- Hệ thống tự động đính kèm `created_by` dựa trên danh tính người dùng đang chọn (chủ hoặc nhân viên).
- Nếu lưu thành công:
  - Form được reset về trạng thái ban đầu (giữ nguyên Ngày mua và danh tính).
  - Hiển thị snackbar "Đã lưu phiếu".
  - Bảng tổng chi hôm nay cập nhật ngay lập tức.
- Nếu lỗi: giữ nguyên dữ liệu trên form, hiển thị thông báo lỗi.

---

### 4.2 Quản lý phiếu nhập (Entry Management)

**Description:** Cho phép chủ quán xem lại, tìm kiếm, và sửa lỗi các phiếu nhập đã ghi (qua cơ chế đính chính). Không hỗ trợ xóa phiếu nhập. Realizes UJ-1 (edge case: sửa phiếu nhập sai).

**Functional Requirements:**

#### FR-9: Danh sách phiếu nhập

Chủ quán xem danh sách tất cả phiếu nhập, hiển thị thông tin tóm tắt mỗi dòng.

**Consequences (testable):**

- Mỗi dòng hiển thị: ngày mua, tên hàng hóa, số lượng + đơn vị, NCC, số tiền, hình thức thanh toán.
- Sắp xếp mặc định: mới nhất trước (theo ngày mua, cùng ngày thì theo thời điểm tạo).
- Infinite scroll — tải 20 phiếu nhập mỗi lần khi cuộn xuống. `[ASSUMPTION]`

#### FR-10: Lọc theo khoảng ngày

Chủ quán lọc danh sách phiếu nhập theo khoảng thời gian.

**Consequences (testable):**

- Chọn ngày bắt đầu và ngày kết thúc.
- Có preset nhanh: Hôm nay, Tuần này (T2→CN), Tháng này. `[ASSUMPTION]`
- Kết quả cập nhật ngay khi chọn filter.

#### FR-11: Tìm kiếm theo tên hàng hóa hoặc NCC

Chủ quán tìm kiếm phiếu nhập bằng từ khóa.

**Consequences (testable):**

- Tìm kiếm khớp partial match trên trường tên hàng hóa và tên NCC.
- Không phân biệt hoa thường. `[ASSUMPTION: Cũng không phân biệt dấu tiếng Việt — "ca phe" khớp "Cà phê".]`
- Kết quả cập nhật real-time khi gõ (debounce 300ms). `[ASSUMPTION]`

#### FR-12: Sửa lỗi phiếu nhập (Tạo Phiếu Đính Chính)

Chủ quán chỉnh sửa bất kỳ trường nào của phiếu nhập đã lưu, nhưng dưới dạng một trải nghiệm đơn giản che giấu sự phức tạp của cơ chế bù trừ.

**Consequences (testable):**

- Bấm "Đính chính" vào phiếu nhập → mở form với dữ liệu hiện tại đã điền sẵn.
- Chủ quán nhập giá trị đúng.
- Lưu thay đổi sẽ gạch mờ hiển thị của phiếu nhập gốc trên giao diện, hiển thị dòng đúng, và cập nhật tổng chi.
- Phía backend (không hiển thị): hệ thống thực chất là Append-only (không chạy câu lệnh UPDATE/DELETE). Nó tạo ra một Phiếu đính chính bù trừ chênh lệch và ghi nhận rõ `corrected_by` là ai. Việc này ẩn hoàn toàn với người dùng để giữ trải nghiệm như "sửa sổ tay".

---

### 4.3 Tổng hợp chi phí (Expense Summary)

**Description:** Hiển thị tổng số tiền đã chi theo các khung thời gian: ngày, tuần (Thứ Hai → Chủ Nhật), tháng. Chủ quán chỉ cần 1 thao tác để biết tổng chi. Realizes UJ-3.

**Functional Requirements:**

#### FR-14: Tổng chi theo ngày

Chủ quán xem tổng số tiền đã chi trong một ngày cụ thể.

**Consequences (testable):**

- Tổng chi hôm nay hiển thị trên màn hình chính, luôn visible không cần thao tác thêm. `[ASSUMPTION]`
- Có thể chọn ngày khác để xem tổng.
- Format: số tiền VNĐ có dấu chấm phân cách hàng nghìn + ký hiệu ₫ (ví dụ: 1.250.000₫).

#### FR-15: Tổng chi theo tuần

Chủ quán xem tổng chi trong tuần hiện tại hoặc tuần được chọn. Realizes UJ-3.

**Consequences (testable):**

- Tuần tính từ Thứ Hai đến Chủ Nhật.
- Hiển thị tổng chi tuần hiện tại.
- Hiển thị so sánh với tuần trước (ví dụ: "4.200.000₫ — ↑12% so với tuần trước"). `[ASSUMPTION]`

#### FR-16: Tổng chi theo tháng

Chủ quán xem tổng chi trong tháng hiện tại hoặc tháng được chọn.

**Consequences (testable):**

- Hiển thị tổng chi tháng hiện tại.
- Có thể chọn tháng / năm khác để xem (dropdown). `[ASSUMPTION]`

---

### 4.4 Đồng bộ dữ liệu đa thiết bị (Cross-Device Sync)

**Description:** Dữ liệu phiếu nhập được lưu trên server, truy cập được từ bất kỳ thiết bị nào có internet. Nhập trên điện thoại ở chợ, xem trên máy tính ở quán — không mất dữ liệu khi đổi thiết bị hay xóa cache trình duyệt. Đây là yêu cầu nghiệp vụ; cách triển khai kỹ thuật do kiến trúc sư quyết định.

**Functional Requirements:**

#### FR-19: Lưu trữ server-side

Tất cả dữ liệu phiếu nhập được persist trên server.

**Consequences (testable):**

- Dữ liệu không bị mất khi xóa cache trình duyệt, đổi thiết bị, hoặc dùng incognito mode.
- Thời gian response cho các thao tác CRUD < 500ms ở điều kiện mạng bình thường. `[ASSUMPTION]`

#### FR-20: Truy cập đa thiết bị không cần đăng nhập

Chủ quán truy cập cùng dữ liệu từ nhiều thiết bị mà không cần đăng nhập.

**Consequences (testable):**

- Cùng URL, cùng dữ liệu trên mọi thiết bị.
- `[ASSUMPTION: Không cần đăng nhập nghĩa là tool sử dụng một shared instance duy nhất — bất kỳ ai có URL đều truy cập được. Bảo mật dựa trên URL không public (security through obscurity). Chấp nhận rủi ro này ở v1 vì tool chỉ dùng nội bộ và dữ liệu không chứa thông tin nhạy cảm.]`

## 5. Non-Goals (Explicit)

- **Không quản lý doanh thu / tính lãi lỗ** — tool chỉ theo dõi chi phí mua hàng đầu vào, không phải hệ thống kế toán toàn diện.
- **Không phân loại chi phí theo danh mục** — v1 không có category (nguyên liệu, vận hành, trang trí). Tất cả phiếu nhập đều ngang hàng, flat list.
- **Không quản lý tồn kho** — không theo dõi số lượng tồn, không cảnh báo hết hàng, không liên kết hàng hóa nhập vào với hàng hóa đã dùng.
- **Không đính kèm ảnh hóa đơn** — chỉ nhập text.
- **Không có hệ thống đăng nhập / phân quyền** — single-user; ai có URL đều dùng được.
- **Không hỗ trợ nhiều chi nhánh** — v1 phục vụ 1 quán duy nhất.
- **Không hoạt động offline** — cần internet để sử dụng.
- **Không phải POS system** — không bán hàng, không in hóa đơn, không quản lý menu.
- **Không có báo cáo phân tích / biểu đồ** — v1 chỉ hiển thị tổng số, không có chart hay graph.
- **Không xuất báo cáo Excel/CSV** — ứng dụng chỉ nhằm mục đích giúp chủ quán tra cứu tổng chi nhanh nhất trên thiết bị.

## 6. MVP Scope

### 6.1 In Scope

- Form nhập phiếu nhập tối ưu cho mobile (tối thiểu thao tác, mục tiêu < 30s/phiếu)
- Autocomplete tên hàng hóa + NCC từ lịch sử nhập
- Đơn vị chọn từ dropdown cố định (10 tùy chọn + "Khác")
- Ngày mua mặc định hôm nay, cho phép sửa
- Cơ chế định danh siêu tốc (Honor System) qua nút bấm chọn tên
- Trường ghi chú tùy chọn
- Hình thức thanh toán: Tiền mặt / Chuyển khoản
- Danh sách phiếu nhập: xem, đính chính lỗi (với trải nghiệm người dùng đơn giản nhưng kiến trúc backend là Append-only)
- Lọc theo khoảng ngày, tìm kiếm theo tên hàng hóa / NCC
- Tổng hợp chi phí theo ngày / tuần (T2→CN) / tháng
- Backend lưu trữ dữ liệu + đồng bộ đa thiết bị
- Deploy trên Vercel
- Hỗ trợ 1 chi nhánh
- Không cần đăng nhập

### 6.2 Out of Scope for MVP

- **Quản lý doanh thu / lãi lỗ** — tool là expense tracker, không phải accounting system.
- **Phân loại chi phí theo danh mục** — giữ flat list đơn giản ở v1. `[NOTE FOR PM: Nếu quán mua > 15 loại hàng hóa khác nhau, danh sách sẽ khó scan. Cân nhắc category ở v2.]`
- **Quản lý tồn kho / cảnh báo hết hàng** — scope hoàn toàn khác.
- **Đính kèm ảnh hóa đơn** — tốn storage, phức tạp UX trên mobile. Deferred v2.
- **Xuất Excel / PDF** — loại bỏ để giữ ứng dụng gọn nhẹ tối đa.
- **Hệ thống đăng nhập / phân quyền** — single-user cho đến khi mở thêm chi nhánh.
- **Hỗ trợ nhiều chi nhánh** — v2, khi quán mở rộng.
- **Danh sách NCC quản lý (CRUD)** — v1 dùng autocomplete text tự do; v2 mới cần quản lý danh sách chính thức.
- **Offline support** — cần internet để sử dụng. `[NOTE FOR PM: Rủi ro thực tế — chủ quán đi chợ, sóng 4G yếu. Cân nhắc service worker + offline queue ở v2.]`
- **Báo cáo chi tiết / biểu đồ** — v1 chỉ hiển thị tổng số. Chart/graph deferred.

## 7. Success Metrics

**Primary**

- **SM-1**: Thời gian nhập 1 phiếu nhập trên mobile ≤ 30 giây (từ mở form đến bấm Lưu). Validates FR-1 → FR-8.
- **SM-2**: Tổng chi tháng hiển thị chính xác chỉ với 1 thao tác (tap/click). Validates FR-14, FR-15, FR-16.
- **SM-3**: Sau 1 tuần sử dụng, chủ quán tự nhập ≥ 80% các lần mua hàng vào tool (thay vì bỏ qua hoặc quên). Validates adoption toàn hệ thống.

**Secondary**

- (Không có - mọi trọng tâm đều dồn vào nhập liệu nhanh và xem tổng số).

**Counter-metrics (do not optimize)**

- **SM-C1**: Thời gian nhập không được giảm bằng cách bỏ validation hoặc bỏ trường bắt buộc — nhập nhanh mà dữ liệu thiếu thì vô nghĩa. Counterbalances SM-1.
- **SM-C2**: Tỷ lệ adoption (SM-3) không được tăng bằng cách ép nhập hoặc tạo ma sát khi không nhập — tool phải đủ tiện để chủ quán *muốn* dùng. Counterbalances SM-3.

## 8. Cross-Cutting NFRs

- **Performance**: Page load < 3 giây trên mạng 4G. Autocomplete response < 200ms. `[ASSUMPTION]`
- **Responsive**: Mobile-first; layout tối ưu cho viewport 375px (iPhone SE) trở lên. Dùng được trên desktop (≥ 1024px) nhưng không yêu cầu desktop-specific UX optimization. `[ASSUMPTION: Breakpoint chính: 375px mobile, 1024px desktop.]`
- **Data volume**: Hỗ trợ tối thiểu 10.000 phiếu nhập (~18 tháng dữ liệu ở mức 20 phiếu/ngày) mà không suy giảm hiệu năng đáng kể. `[ASSUMPTION]`
- **Availability**: Uptime ≥ 99% (dựa trên Vercel SLA). Chấp nhận downtime ngắn khi deploy phiên bản mới.
- **Browser support**: Chrome và Safari — cả mobile lẫn desktop. `[ASSUMPTION: Không cần hỗ trợ IE, Firefox, hoặc trình duyệt ít phổ biến.]`

## 9. Constraints and Guardrails

### Data Protection

- Kiến trúc Append-only (chỉ ghi thêm). Không cho phép sửa hay xóa dữ liệu gốc ở cấp độ cơ sở dữ liệu để đảm bảo tính toàn vẹn (tamper-proof). Sửa lỗi được thực hiện ngầm bằng phiếu đính chính bù trừ, mô phỏng trải nghiệm người dùng như gạch ngang viết lại sổ tay. Tích hợp chặt chẽ việc khóa thay đổi quá khứ.
- **Audit Trail**: Mọi hành động thêm mới hoặc đính chính đều được gắn chặt với danh tính người dùng (chủ hoặc nhân viên) qua trường `created_by` / `corrected_by`, triệt tiêu khả năng chối bỏ trách nhiệm trong quy mô nhỏ.

### Privacy

- Dữ liệu chỉ chứa thông tin mua hàng quán cafe — không có PII nhạy cảm (không lưu CMND, số tài khoản ngân hàng, thông tin cá nhân khách hàng).
- URL không public, không được index bởi search engine (meta tag `noindex, nofollow`). `[ASSUMPTION]`

### Cost

- Deploy trên Vercel free tier hoặc hobby plan. Kiến trúc sư cần chọn database và infrastructure phù hợp với giới hạn free/hobby tier. `[ASSUMPTION: Budget ưu tiên miễn phí hoặc chi phí rất thấp.]`

## 10. Open Questions

Tất cả câu hỏi dưới đây được chuyển (deferred) sang cho giai đoạn thiết kế Architecture / UX:

1. **Database choice**: Backend dùng database gì? (PostgreSQL trên Supabase? SQLite trên Turso? Vercel Postgres?) — Quyết định thuộc kiến trúc sư.
2. **Autocomplete diacritics**: Tìm kiếm "ca phe" có nên khớp "Cà phê" không? Hiện gắn `[ASSUMPTION]` là có — cần confirm đây có phải UX mong muốn không.
3. **Backup strategy**: Có cần cơ chế backup dữ liệu tự động không? Nếu database provider gặp sự cố, dữ liệu mất thì sao?
4. **Access control nhẹ**: Nếu ai có URL đều truy cập được (không đăng nhập), có cần ít nhất một lớp bảo vệ nhẹ (ví dụ: PIN 4 số khi mở lần đầu trên thiết bị mới) không? Hay chấp nhận security through obscurity ở v1?
5. **Đơn vị "Khác"**: Khi chọn "Khác" và gõ đơn vị tùy chỉnh, đơn vị đó có nên được thêm vào danh sách dropdown cố định cho lần sau không? Hay luôn giữ danh sách cố định?

## 11. Assumptions Index

*(Cập nhật: Tất cả giả định dưới đây đã được người dùng ngầm định xác nhận (approved by default) vào ngày 2026-06-21. Có thể tiếp tục tinh chỉnh trong lúc làm UX/Architecture nếu cần).*

Tất cả `[ASSUMPTION]` từ tài liệu, tổng hợp để xác nhận:

| # | Section | Assumption |
|---|---------|------------|
| A1 | §FR-1 | Cho phép chọn ngày trong quá khứ tối đa 30 ngày, không cho phép chọn ngày tương lai. |
| A2 | §FR-2 | Tìm kiếm autocomplete không phân biệt dấu tiếng Việt — gõ "ca phe" khớp "Cà phê bột". |
| A3 | §FR-2 | Gợi ý autocomplete sắp xếp theo recency-weighted frequency. |
| A4 | §FR-3 | Số lượng chấp nhận số thập phân (0.5, 1.5, ...). |
| A5 | §FR-3 | Chọn "Khác" hiển thị ô text để gõ đơn vị tùy chỉnh. |
| A6 | §FR-3 | Số lượng + đơn vị không bắt buộc — có thể bỏ trống. |
| A7 | §FR-4 | NCC không bắt buộc — có thể bỏ trống. |
| A8 | §FR-5 | Chỉ chấp nhận số nguyên dương (VNĐ không có đơn vị xu). |
| A9 | §FR-6 | Hình thức thanh toán mặc định là "Tiền mặt". |
| A10 | §FR-7 | Ghi chú giới hạn 500 ký tự. |
| A11 | §FR-9 | Infinite scroll, tải 20 phiếu nhập mỗi lần. |
| A12 | §FR-10 | Có preset filter nhanh: Hôm nay, Tuần này, Tháng này. |
| A13 | §FR-11 | Tìm kiếm không phân biệt dấu tiếng Việt; debounce 300ms. |
| A14 | §FR-14 | Tổng chi hôm nay luôn visible trên màn hình chính. |
| A15 | §FR-15 | Hiển thị so sánh % với tuần trước. |
| A16 | §FR-16 | Dropdown chọn tháng/năm để xem tổng chi tháng khác. |
| A17 | §FR-19 | Response time CRUD < 500ms ở điều kiện mạng bình thường. |
| A21 | §FR-20 | Xác thực bằng Honor System (chọn tên không cần mật khẩu) là đủ an toàn cho quy mô 3 người và tiết kiệm tối đa thời gian. |
| A22 | §NFR | Page load < 3s trên 4G. Autocomplete < 200ms. |
| A23 | §NFR | Breakpoint chính: 375px mobile, 1024px desktop. Không cần support IE/Firefox. |
| A24 | §NFR | Hỗ trợ tối thiểu 10.000 phiếu nhập mà không suy giảm hiệu năng. |
| A25 | §Constraints | Không có bulk delete ở v1. |
| A26 | §Constraints | URL có meta tag noindex, nofollow. |
| A27 | §Constraints | Budget ưu tiên miễn phí hoặc chi phí rất thấp (Vercel free/hobby tier). |
