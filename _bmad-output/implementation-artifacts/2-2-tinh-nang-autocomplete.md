---
title: "Story 2.2: Tính năng Autocomplete Tên Hàng & NCC"
status: done
---

# Story 2.2: Tính năng Autocomplete Tên Hàng & NCC

## 📖 Story Foundation

**User Story:**
As a Người dùng,
I want hệ thống gợi ý tên món hàng và tên nhà cung cấp khi tôi mới gõ vài chữ, kèm theo mức giá cũ,
So that tôi không phải gõ tay toàn bộ tên và không cần gõ lại số tiền nếu mua với giá không đổi.

**Acceptance Criteria:**
1. **Given** người dùng đang điền trường Tên hàng (`name`) hoặc Nhà Cung Cấp (`supplier`)
   **When** họ gõ từ 1 ký tự trở lên (vd: "ca")
   **Then** hệ thống gọi API/Server Action để query danh sách các item cũ (không phân biệt dấu tiếng Việt) và hiển thị dropdown gợi ý (tối đa 5 mục).
2. **Given** dropdown gợi ý đang hiển thị cho Tên Hàng
   **When** người dùng chạm để chọn một món hàng đã từng mua (ví dụ: "Cà phê hạt")
   **Then** hệ thống tự động điền "Cà phê hạt" vào ô Tên hàng.
   **And** hệ thống tự động điền luôn **Đơn vị** (ví dụ: "kg") và **Số tiền** (ví dụ: 250,000) của lần mua gần nhất vào các ô tương ứng.
3. **Given** thông tin tự động điền đã hiển thị trên form
   **When** người dùng nhìn vào form
   **Then** người dùng có quyền để nguyên mức giá đó hoặc gõ đè lại giá mới nếu hôm nay giá thay đổi.

---

## 🛠️ Developer Context & Guardrails

### 1. Kiến trúc & Supabase Query
- **Vấn đề Unaccent:** Mặc dù extension `unaccent` đã được bật ở CSDL, query mặc định của Supabase JS (`.ilike()`) không hỗ trợ unaccent trực tiếp. 
- **Giải pháp:** Cần viết một **Server Action** hoặc sử dụng trực tiếp Supabase SQL/RPC để query. Tuy nhiên, cách tốt nhất là chạy một Database Migration để tạo **RPC Function** `search_recent_items(search_term text)` và `search_recent_suppliers(search_term text)` có sử dụng hàm `unaccent()` và `DISTINCT ON` để lấy giá trị mới nhất.
- Hoặc giải pháp tạm thời (nếu dữ liệu chưa quá lớn): Dùng Client để load danh sách cache các item thường mua, hoặc viết một Server Action lấy dữ liệu và map ở Server. Lựa chọn ưu tiên là tạo hàm RPC `search_recent_items` trên Supabase.

### 2. Giao diện (UX/UI)
- Custom lại thẻ `<input type="text" />` thành một component `AutocompleteInput`.
- Dropdown (Danh sách gợi ý) phải hiển thị lơ lửng (`position: absolute`, `z-index` cao) ngay dưới ô input.
- Touch-target của mỗi dòng gợi ý trong Dropdown phải đủ lớn (chiều cao tối thiểu 48px), có border ngăn cách các dòng.
- Khi đang gõ, nếu có delay gọi API thì cần debounce (khoảng 300ms) để không bị spam API.

### 3. File Structure Requirements
- `supabase/migrations/xxxx_create_search_rpc.sql`: File SQL migration tạo hàm search hỗ trợ tiếng Việt không dấu (unaccent).
- `src/actions/search.ts`: Server Actions gọi RPC từ Supabase.
- `src/components/autocomplete.tsx`: Component giao diện cho dropdown input.
- Sửa lại `src/components/entry-form.tsx` để thay thế input text thường bằng `<Autocomplete>` component.

### 4. Testing & Validation
- Chạy file SQL migration trên Supabase.
- Gõ "ca" -> Gợi ý ra "Cà phê", "Cá basa".
- Chọn "Cà phê" -> Ô Đơn vị tự động nhảy thành "kg", ô Số tiền tự động nhảy thành "120,000".

---
*Ghi chú hoàn thành:* Ultimate context engine analysis completed - comprehensive developer guide created.
