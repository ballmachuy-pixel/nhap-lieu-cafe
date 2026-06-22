---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-06-21'
project_name: 'nhập liệu'
user_name: 'Admin'
date: '2026-06-21'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Hệ thống là một ứng dụng web ưu tiên thiết bị di động (mobile-first) với 20 FRs tập trung vào 5 nhóm cốt lõi:
- Nhập liệu nhanh (Quick Entry): Tối ưu thao tác (< 30s/phiếu) qua Autocomplete và dropdown.
- Quản lý phiếu nhập: Danh sách vô tận (Infinite scroll), tìm kiếm, và Đính chính lỗi (kiến trúc Append-only).
- Báo cáo cơ bản: Xem tổng chi phí ngày/tuần/tháng trực tiếp trên UI.
- Đồng bộ: Dữ liệu thời gian thực giữa các thiết bị thông qua Backend.

**Non-Functional Requirements:**
- Thiết kế Mobile-first (375px) và hỗ trợ Desktop (1024px).
- Hiệu suất: Thời gian tải trang < 3 giây trên 4G, độ trễ autocomplete < 200ms.
- Khả năng mở rộng: Hỗ trợ mượt mà tối thiểu 10.000 bản ghi (~18 tháng dữ liệu).
- Trình duyệt: Tập trung vào Chrome và Safari hiện đại.

**Scale & Complexity:**
Dự án có quy mô nhỏ và độ phức tạp thấp, ưu tiên tính tiện dụng và sự đơn giản.

- Primary domain: Full-stack Web
- Complexity level: Low (Không Auth, không đa chi nhánh, dữ liệu phẳng)
- Estimated architectural components: 3 (Frontend Web App, Serverless API, Cloud Database)

### Technical Constraints & Dependencies

- Chi phí: Hạ tầng triển khai bị giới hạn trên Vercel Free/Hobby tier.
- Database: Phải chọn giải pháp DB có gói free đủ dùng cho ~10.000+ bản ghi mà không phát sinh chi phí.
- Bảo mật & Định danh: Áp dụng cơ chế "Honor System" (chọn tên nhân viên không cần mật khẩu) để cân bằng giữa sự tiện lợi siêu tốc và dấu vết kiểm toán (Audit Trail) cơ bản.
- Network: Cần kết nối mạng liên tục (không hỗ trợ offline operation trong v1).

### Cross-Cutting Concerns Identified

- Data Persistence & Sync: Quản lý trạng thái giữa thiết bị di động ở chợ và máy tính ở quán, đòi hỏi một nguồn chân lý (Single Source of Truth) lưu trữ trên Cloud.
- State Management: Tối ưu Optimistic UI cho thao tác nhập siêu tốc.
- Data Integrity: Kiến trúc Append-only đảm bảo không có giao dịch nào bị xóa khỏi database, mọi thao tác sửa lỗi đều sinh ra phiếu đính chính ngầm.

## Starter Template Evaluation

### Primary Technology Domain

Full-stack Web Application (dựa trên Next.js App Router) phù hợp với yêu cầu về tốc độ tải trang, triển khai Vercel và quản lý state đơn giản.

### Starter Options Considered

- **Vite + React (SPA)**: Rất nhanh ở phía client, nhưng yêu cầu setup thêm Server/API rời để xử lý DB, làm tăng độ phức tạp deploy.
- **T3 Stack (Next.js, tRPC, Prisma, Tailwind)**: Rất mạnh mẽ, type-safe từ đầu đến cuối, nhưng tRPC và Prisma có thể quá cồng kềnh cho một ứng dụng CRUD đơn giản chỉ có 1 bảng/dữ liệu phẳng.
- **Next.js App Router (Standard Starter)**: Tích hợp hoàn hảo với Vercel, hỗ trợ Server Actions giúp thực hiện các thao tác DB (thêm dữ liệu) mà không cần viết API Routes rời. Rất phù hợp với ứng dụng nhỏ, cần tốc độ code nhanh.

### Selected Starter: Next.js (App Router) + TypeScript + Tailwind CSS

**Rationale for Selection:**
Sự kết hợp giữa Next.js và Vercel mang lại hiệu suất tốt nhất mà không tốn công cấu hình. Việc sử dụng App Router kết hợp Server Actions giúp xử lý dữ liệu biểu mẫu (nhập chi phí) một cách trơn tru, đồng thời việc tích hợp với Supabase PostgreSQL (hoặc Turso) thông qua SDK là cực kỳ nhanh chóng.

**Initialization Command:**

```bash
npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript (Strict mode) đảm bảo tính toàn vẹn của dữ liệu (tránh lỗi null/undefined khi tính toán số tiền).
- Node.js Runtime cho backend (Server Actions).

**Styling Solution:**
- Tailwind CSS: Cho phép xây dựng giao diện mobile-first cực kỳ nhanh chóng theo đúng yêu cầu UI dưới 30s/phiếu, không cần file CSS rời.

**Build Tooling:**
- Next.js Compiler (với SWC) cho tốc độ build và hot-reloading siêu tốc.

**Testing Framework:**
- Mặc định chưa bao gồm (Sẽ cần thêm Jest/Vitest hoặc Playwright sau nếu muốn test luồng nhập liệu).

**Code Organization:**
- Pattern `src/app` cho routing (App Router).
- Cho phép đặt các thành phần UI, lib, server actions gom lại một cách sạch sẽ bằng alias `@/`.

**Development Experience:**
- Cấu hình sẵn ESLint, tự động nhận diện alias đường dẫn, tích hợp sẵn các tập lệnh phát triển `npm run dev`.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Data Architecture (Database & Schema)
- API & Communication (Server Actions)

**Important Decisions (Shape Architecture):**
- Frontend State Management (Optimistic UI)
- Security & Identity Model (Honor System & LocalStorage)

**Deferred Decisions (Post-MVP):**
- Phân quyền User/Auth (Deferred)
- Hỗ trợ Offline PWA (Deferred)

### Data Architecture

- **Database**: Supabase PostgreSQL (Latest stable). Lý do: Cung cấp Free Tier mạnh mẽ, có sẵn tính năng Full Text Search (dễ dàng cấu hình tìm kiếm không dấu qua extension `unaccent` hoặc `ilike`), và SDK tốt.
- **Data Model**: Thiết kế 1 bảng phẳng (flat table) `entries` với các trường cần thiết, đặc biệt là `created_by` và `corrected_by`. Áp dụng nghiêm ngặt kiến trúc **Append-only** (không bao giờ dùng lệnh DELETE/UPDATE), mọi thao tác sửa đều sinh ra bản ghi mới để đối trừ.

### Authentication & Security

- **Security Model**: "Honor System". Ứng dụng không bắt tạo tài khoản phức tạp. Người dùng chạm chọn tên mình (Chủ quán, Nhân viên 1, Nhân viên 2) trên một màn hình đơn giản. Danh tính được lưu tại `localStorage` của trình duyệt điện thoại. Dấu vết kiểm toán (Audit Trail) dựa trên danh tính này, giúp quy trách nhiệm cho từng giao dịch bù trừ trong 1 nhóm rất nhỏ (3 người). Mọi truy cập vào ứng dụng vẫn cần giấu kín (URL ẩn, meta noindex).

### API & Communication Patterns

- **Pattern**: Next.js Server Actions (thay vì RESTful API).
- **Lý do**: Cho phép gọi trực tiếp code backend (Supabase SDK) từ React Components một cách type-safe, giảm thiểu lượng code boilerplate và tăng tốc độ phát triển cực kỳ nhanh.

### Frontend Architecture

- **State Management**: Sử dụng React Hooks (`useState`, `useOptimistic`) kết hợp với Server Actions.
- **Correction Strategy (Sửa lỗi)**: Giao diện mô phỏng việc gạch xóa sổ tay. Thực chất gửi Server Action tạo 1 phiếu âm (để hủy) và 1 phiếu mới (để thay thế) theo chuẩn Append-only. Dữ liệu tải về sẽ hiển thị dòng cũ bị gạch ngang.
- **Search/Autocomplete**: Sử dụng thư viện `use-debounce` để gọi Server Action tìm kiếm tên/NCC khi người dùng gõ, tránh spam DB.

### Infrastructure & Deployment

- **Hosting**: Vercel Free Tier.
- **CI/CD**: Tự động deploy từ GitHub repository.
- **Database Hosting**: Supabase Hosted (Free Tier).

### Decision Impact Analysis

**Implementation Sequence:**
1. Khởi tạo dự án Next.js & Thiết lập Tailwind.
2. Tạo project Supabase, chạy migration tạo bảng `entries` + bật `unaccent`.
3. Xây dựng Server Actions (CRUD).
4. Xây dựng UI Component (Form nhập liệu với Autocomplete).
5. Xây dựng UI Danh sách & Tổng hợp.

**Cross-Component Dependencies:**
- Server Actions sẽ phụ thuộc chặt chẽ vào Database Schema. Bất kỳ thay đổi nào ở CSDL phải cập nhật type của Server Actions.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
4 khu vực chính AI có thể viết code khác nhau gây lỗi: Cách đặt tên biến/DB, Cấu trúc thư mục Server Actions, Định dạng trả về của API, và Xử lý lỗi.

### Naming Patterns

**Database Naming Conventions:**
- Sử dụng `snake_case` cho toàn bộ tên bảng và cột.
- Bảng: `entries` (số nhiều).
- Cột: `id`, `name`, `supplier`, `amount`, `created_at`, `created_by`, `corrected_by`, `correction_for_id` (tham chiếu ID phiếu bị sửa).

**Code Naming Conventions:**
- **React Components**: `PascalCase` (ví dụ: `EntryForm.tsx`, `SummaryCard.tsx`).
- **Server Actions**: Luôn bắt đầu bằng chữ `action` theo `camelCase` (ví dụ: `actionCreateEntry`, `actionSoftDeleteEntry`) để phân biệt rõ với hàm gọi ở Client.
- **Biến/Hàm cục bộ**: `camelCase` (ví dụ: `handleDelete`, `totalAmount`).
- **Files**:
  - Tên file UI Component: `PascalCase.tsx`.
  - Tên file tiện ích/Server Actions: `kebab-case.ts` (ví dụ: `entry-actions.ts`).

### Structure Patterns

**Project Organization:**
Toàn bộ mã nguồn nằm trong thư mục `src/`:
- `src/app/`: Chứa UI chính (App Router pages).
- `src/components/`: Chứa các Reusable Components (VD: Button, Input, Snackbar).
- `src/components/features/`: Chứa các Component theo tính năng (VD: EntryList, EntryForm).
- `src/actions/`: Chứa toàn bộ Server Actions giao tiếp với Supabase.
- `src/lib/`: Chứa utils, types, cấu hình Supabase SDK.

### Format Patterns

**Server Action Response Formats:**
Mọi Server Action phải luôn trả về một object theo chuẩn chung để Frontend dễ xử lý:
```typescript
type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### Communication & State Patterns

**State Management Patterns:**
- **Thêm mới**: Gọi Server Action, đợi phản hồi `success: true` rồi mới reset form và gọi `revalidatePath()` để cập nhật UI tự động.
- **Đính chính (Sửa)**: Hiển thị dòng cũ bị gạch ngang ngay lập tức (Optimistic UI), gọi Server Action sinh bản ghi đính chính.

### Process Patterns

**Error Handling Patterns:**
- **Backend (Server Actions)**: Luôn bọc trong `try/catch`. Catch block phải log lỗi chi tiết (nếu cần) và trả về `{ success: false, error: "Thông báo lỗi tiếng Việt ngắn gọn" }`.
- **Frontend**: Nhận error từ Server Action và hiển thị qua component `Snackbar` màu đỏ (Toast notification). Không bao giờ throw error làm văng giao diện (crash app).

### Enforcement Guidelines

**All AI Agents MUST:**
- KHÔNG tự ý tạo route API riêng lẻ (`app/api/...`) mà phải dùng thư mục `src/actions/`.
- KHÔNG query trực tiếp Supabase từ Client Components để bảo mật khóa kết nối.
- KHÔNG sử dụng lệnh UPDATE hoặc DELETE trên bảng `entries`. Phải luôn tạo bản ghi mới (INSERT).

### Pattern Examples

**Good Examples:**
```typescript
// src/actions/entry-actions.ts
export async function actionCreateEntry(payload: EntryInput): Promise<ActionResponse<Entry>> {
  try {
    const { data, error } = await supabase.from('entries').insert(payload).select().single();
    if (error) throw error;
    revalidatePath('/');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Không thể lưu phiếu nhập. Vui lòng thử lại.' };
  }
}
```

**Anti-Patterns:**
- Quên bọc `try/catch` trong Server Actions.
- Component viết chung lệnh Fetch API và Logic UI trong cùng một file mà không tách ra `actions`.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
nhap-lieu-app/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.local             (Biến môi trường kết nối Supabase)
├── .gitignore
├── src/
│   ├── app/
│   │   ├── globals.css    (CSS Reset & Tailwind directives)
│   │   ├── layout.tsx     (Root layout, thẻ meta noindex)
│   │   ├── page.tsx       (Trang chủ: Hiện Tổng hợp chi phí & Form nhập nhanh)
│   │   ├── danh-sach/
│   │   │   └── page.tsx   (Trang xem lại và đính chính lỗi)
│   ├── components/
│   │   ├── ui/            (Components dùng chung cơ bản)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Snackbar.tsx
│   │   └── features/      (Components theo nghiệp vụ)
│   │       ├── EntryForm.tsx
│   │       ├── EntryList.tsx
│   │       ├── EntryItem.tsx
│   │       └── SummaryCard.tsx
│   ├── actions/
│   │   └── entry-actions.ts (Toàn bộ Server Actions tương tác Supabase)
│   └── lib/
│       ├── supabase.ts    (Cấu hình Supabase Client)
│       ├── utils.ts       (Hàm format tiền, debounce, date format)
│       └── types.ts       (TypeScript interfaces)
└── supabase/
    └── migrations/        (Các file .sql chứa cấu trúc bảng `entries` và unaccent)
```

### Architectural Boundaries

**API Boundaries:**
- Không sử dụng API Routes nội bộ. Toàn bộ giao tiếp CSDL được đóng gói qua ranh giới **Server Actions** (nằm ở `src/actions/`).

**Component Boundaries:**
- `app/page.tsx` và `app/danh-sach/page.tsx` đóng vai trò là Server Components (fetch dữ liệu lần đầu).
- Các components tương tác trong `components/features/` (như `EntryForm`, `EntryList`) sẽ là Client Components (có `"use client"`).

**Data Boundaries:**
- Dữ liệu duy nhất của toàn bộ hệ thống nằm ở bảng `entries` trên Supabase. Frontend không duy trì dữ liệu offline dài hạn, chỉ cache qua `revalidatePath` của Next.js.

### Requirements to Structure Mapping

**Feature/Epic Mapping:**
- **Quick Entry (FR 1-8)**: Nằm gọn trong `src/components/features/EntryForm.tsx` gọi `src/actions/entry-actions.ts`. Đọc danh tính từ `localStorage`.
- **Entry Management (FR 9-13)**: Nằm ở trang `app/danh-sach/page.tsx` sử dụng `EntryList.tsx`.
- **Expense Summary (FR 14-16)**: UI đặt ở `SummaryCard.tsx`, logic lấy dữ liệu nằm trực tiếp trong Server Components `page.tsx`.

### File Organization Patterns

- **Configuration Files**: Nằm gọn ở thư mục root (Next, Tailwind, TS).
- **Source Code**: Đóng gói 100% trong thư mục `src/` để cách ly hoàn toàn với các file cấu hình.
- **Database Schema**: Quản lý version qua thư mục `supabase/migrations/` (hoặc có thể dùng Prisma schema nếu thay đổi quyết định, nhưng ở đây ta dùng direct SQL qua Supabase).

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
Toàn bộ các công nghệ được chọn (Next.js, Tailwind, Supabase) hoàn toàn tương thích và là stack tiêu chuẩn trong ngành, hỗ trợ lẫn nhau rất tốt trên nền tảng Vercel. Không có xung đột kỹ thuật nào được phát hiện.

**Pattern Consistency:**
Các quy tắc đặt tên (naming), xử lý dữ liệu (Server Actions) và UI (Optimistic Updates) đã được chuẩn hóa để tương thích với Next.js App Router, giúp việc code của AI Agent nhất quán tuyệt đối.

**Structure Alignment:**
Cấu trúc thư mục được thiết kế cô lập hoàn toàn UI (app/components) và Logic kết nối DB (actions/lib), tuân thủ đúng mô hình phân lớp.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
- Tính năng Nhập nhanh: Hỗ trợ bởi UI Component + Server Actions. Lấy danh tính từ LocalStorage.
- Tính năng Danh sách & Đính chính: Hỗ trợ bởi cơ chế Append-only từ CSDL và UI hiển thị gạch ngang.
- Tính năng Báo cáo & Tổng hợp: Tối ưu trực tiếp bằng SQL Query trên Supabase.

**Functional Requirements Coverage:**
Toàn bộ 20 FRs từ PRD đã có hướng giải quyết kỹ thuật ở mức ranh giới Component/Server Action.

**Non-Functional Requirements Coverage:**
- Mobile-first & Responsive được giải quyết bằng Tailwind CSS.
- Tốc độ tải trang & phản hồi được giải quyết nhờ SSR (Server-Side Rendering) của Next.js kết hợp Vercel Edge Cache.
- Nhu cầu đồng bộ hóa được giải quyết trọn vẹn thông qua database cloud Supabase.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Tất cả các thành phần cốt lõi từ Framework, Database, đến Routing và State đều đã được chốt phiên bản và lý do rõ ràng.

**Structure Completeness:**
Sơ đồ cây thư mục (Project Tree) được ánh xạ 1-1 với các tính năng. Các thư mục rác hoặc thừa đã bị loại bỏ.

**Pattern Completeness:**
Đã định nghĩa cả "Good Examples" và "Anti-Patterns", làm rào chắn an toàn khi AI sinh code.

### Gap Analysis Results

Hiện tại không phát hiện **Critical Gap** hay **Important Gap** nào. Thiết kế đã đáp ứng đủ và chính xác Scope v1 của PRD.

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
Sự đơn giản và thực dụng là điểm mạnh nhất của kiến trúc này. Việc loại bỏ Auth, sử dụng Server Actions và Supabase giúp giảm thời gian go-live xuống mức thấp nhất, cực kỳ phù hợp cho một ứng dụng nội bộ nhỏ.

**Areas for Future Enhancement:**
- Nâng cấp lên PWA (Progressive Web App) để hỗ trợ nhập offline và đồng bộ nền (Sync Queue) khi rớt mạng.
- Thêm cơ chế Authentication nếu quán có thêm nhân viên cần phân quyền.

### Implementation Handoff

**AI Agent Guidelines:**
- Tuân thủ nghiêm ngặt mọi quyết định kiến trúc trong tài liệu này.
- Mọi truy xuất CSDL phải đi qua `src/actions/`.
- Không tự ý thêm thư viện ngoài hoặc thay đổi cấu trúc cây thư mục đã được định nghĩa.

**First Implementation Priority:**
```bash
npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
