# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> App Nhập Liệu Quán Cafe >> Nhập liệu và lưu phiếu test
- Location: tests\home.spec.ts:49:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Đã lưu phiếu nhập!')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('Đã lưu phiếu nhập!')

```

```yaml
- main:
  - heading "Ghi chép chi tiêu" [level=1]
  - link "🕒 Lịch sử":
    - /url: /history
  - text: 👤 Chủ quán TỔNG CHI HÔM NAY 22/06/2026
  - paragraph: Tiền mặt
  - paragraph
  - paragraph: Chuyển khoản
  - paragraph
  - text: Ngày mua
  - textbox: 2026-06-22
  - text: Tên hàng hóa
  - 'textbox "VD: Cà phê hạt..."': TEST AUTOMATION E2E
  - text: Số lượng (tùy chọn)
  - spinbutton: "2"
  - text: Đơn vị
  - combobox:
    - option "kg" [selected]
    - option "lít"
    - option "cái"
    - option "hộp"
    - option "gói"
    - option "bó"
    - option "lạng"
    - option "chai"
    - option "lon"
    - option "túi"
    - option "Khác..."
  - text: Nhà cung cấp (tùy chọn)
  - 'textbox "VD: Cô Hai chợ đầu mối"'
  - text: Số tiền (VNĐ)
  - textbox "0": "50.000"
  - text: ₫ Hình thức thanh toán
  - button "Tiền mặt"
  - button "Chuyển khoản"
  - text: Ghi chú (tùy chọn)
  - textbox "Thêm ghi chú nếu cần...": Đây là dữ liệu test tự động bằng Playwright
  - button "LƯU PHIẾU NHẬP"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('App Nhập Liệu Quán Cafe', () => {
  4  |   
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Bơm thẳng localStorage vào trước khi trang load để bypass AuthGuard
  7  |     await page.addInitScript(() => {
  8  |       window.localStorage.setItem("honor_identity", "Chủ quán");
  9  |     });
  10 |     await page.goto('/');
  11 |   });
  12 | 
  13 |   test('Hiển thị giao diện chính thành công', async ({ page }) => {
  14 |     // Kiểm tra Header
  15 |     await expect(page.getByText('Ghi chép chi tiêu')).toBeVisible();
  16 |     await expect(page.getByRole('link', { name: 'Lịch sử' })).toBeVisible();
  17 | 
  18 |     // Kiểm tra Thẻ Tổng chi hôm nay
  19 |     await expect(page.getByText('TỔNG CHI HÔM NAY')).toBeVisible();
  20 | 
  21 |     // Kiểm tra Form nhập liệu
  22 |     await expect(page.getByLabel('Ngày mua')).toBeVisible();
  23 |     await expect(page.getByPlaceholder('VD: Cà phê hạt...')).toBeVisible();
  24 |     await expect(page.getByRole('button', { name: 'LƯU PHIẾU NHẬP' })).toBeVisible();
  25 |   });
  26 | 
  27 |   test('Báo lỗi khi không nhập tên hàng hóa và số tiền', async ({ page }) => {
  28 |     // Nhấn Lưu ngay lập tức
  29 |     await page.getByRole('button', { name: 'LƯU PHIẾU NHẬP' }).click();
  30 | 
  31 |     const nameInput = page.getByPlaceholder('VD: Cà phê hạt...');
  32 |     const isValid = await nameInput.evaluate((el: HTMLInputElement) => el.checkValidity());
  33 |     expect(isValid).toBeFalsy();
  34 |   });
  35 | 
  36 |   test('Chuyển tab Tiền mặt và Chuyển khoản', async ({ page }) => {
  37 |     const btnTienMat = page.getByRole('button', { name: 'Tiền mặt' });
  38 |     const btnChuyenKhoan = page.getByRole('button', { name: 'Chuyển khoản' });
  39 | 
  40 |     // Tiền mặt được chọn mặc định
  41 |     await expect(btnTienMat).toHaveClass(/bg-primary-50/);
  42 |     
  43 |     // Đổi sang chuyển khoản
  44 |     await btnChuyenKhoan.click();
  45 |     await expect(btnChuyenKhoan).toHaveClass(/bg-primary-50/);
  46 |     await expect(btnTienMat).not.toHaveClass(/bg-primary-50/);
  47 |   });
  48 | 
  49 |   test('Nhập liệu và lưu phiếu test', async ({ page }) => {
  50 |     // Điền thông tin
  51 |     await page.getByPlaceholder('VD: Cà phê hạt...').fill('TEST AUTOMATION E2E');
  52 |     await page.getByPlaceholder('0', { exact: true }).first().fill('2'); // số lượng
  53 |     await page.getByPlaceholder('0', { exact: true }).nth(1).fill('50000'); // số tiền (amountStr)
  54 |     await page.getByPlaceholder('Thêm ghi chú nếu cần...').fill('Đây là dữ liệu test tự động bằng Playwright');
  55 | 
  56 |     // Chuyển khoản
  57 |     await page.getByRole('button', { name: 'Chuyển khoản' }).click();
  58 | 
  59 |     // Lưu phiếu
  60 |     await page.getByRole('button', { name: 'LƯU PHIẾU NHẬP' }).click();
  61 | 
  62 |     // Đợi thông báo thành công (Sonner toast)
> 63 |     await expect(page.getByText('Đã lưu phiếu nhập!')).toBeVisible({ timeout: 10000 });
     |                                                        ^ Error: expect(locator).toBeVisible() failed
  64 |   });
  65 | 
  66 |   test('Điều hướng sang trang Lịch sử', async ({ page }) => {
  67 |     await page.getByRole('link', { name: 'Lịch sử' }).click();
  68 |     
  69 |     // Chờ trang lịch sử load
  70 |     await expect(page).toHaveURL(/.*history/);
  71 |     await expect(page.getByText('Lịch sử nhập liệu')).toBeVisible();
  72 |     await expect(page.getByPlaceholder('Tìm theo tên hàng, nhà cung cấp, ghi chú...')).toBeVisible();
  73 |   });
  74 | });
  75 | 
```