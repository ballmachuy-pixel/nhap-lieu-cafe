import { test, expect } from '@playwright/test';

test.describe('App Nhập Liệu Quán Cafe', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập bằng mã PIN
    await page.goto('/login');
    // Bấm mã PIN 9999
    await page.getByRole('button', { name: '9', exact: true }).click();
    await page.getByRole('button', { name: '9', exact: true }).click();
    await page.getByRole('button', { name: '9', exact: true }).click();
    await page.getByRole('button', { name: '9', exact: true }).click();
    await page.waitForURL('**/');
  });

  test('Hiển thị giao diện chính thành công', async ({ page }) => {
    // Kiểm tra Header
    await expect(page.getByText('Ghi chép chi tiêu')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lịch sử' })).toBeVisible();

    // Kiểm tra Thẻ Tổng chi hôm nay
    await expect(page.getByText('TỔNG CHI HÔM NAY')).toBeVisible();

    // Kiểm tra Form nhập liệu
    await expect(page.getByLabel('Ngày mua')).toBeVisible();
    await expect(page.getByPlaceholder('VD: Cà phê hạt...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'LƯU PHIẾU NHẬP' })).toBeVisible();
  });

  test('Báo lỗi khi không nhập tên hàng hóa và số tiền', async ({ page }) => {
    // Nhấn Lưu ngay lập tức
    await page.getByRole('button', { name: 'LƯU PHIẾU NHẬP' }).click();

    const nameInput = page.getByPlaceholder('VD: Cà phê hạt...');
    const isValid = await nameInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isValid).toBeFalsy();
  });

  test('Chuyển tab Tiền mặt và Chuyển khoản', async ({ page }) => {
    const btnTienMat = page.getByRole('button', { name: 'Tiền mặt' });
    const btnChuyenKhoan = page.getByRole('button', { name: 'Chuyển khoản' });

    // Tiền mặt được chọn mặc định
    await expect(btnTienMat).toHaveClass(/bg-primary-50/);
    
    // Đổi sang chuyển khoản
    await btnChuyenKhoan.click();
    await expect(btnChuyenKhoan).toHaveClass(/bg-primary-50/);
    await expect(btnTienMat).not.toHaveClass(/bg-primary-50/);
  });

  test('Nhập liệu và lưu phiếu test', async ({ page }) => {
    // Điền thông tin
    await page.getByPlaceholder('VD: Cà phê hạt...').fill('TEST AUTOMATION E2E');
    await page.getByPlaceholder('0', { exact: true }).first().fill('2'); // số lượng
    await page.getByPlaceholder('0', { exact: true }).nth(1).fill('50000'); // số tiền (amountStr)
    await page.getByPlaceholder('Thêm ghi chú nếu cần...').fill('Đây là dữ liệu test tự động bằng Playwright');

    // Chuyển khoản
    await page.getByRole('button', { name: 'Chuyển khoản' }).click();

    // Lưu phiếu
    await page.getByRole('button', { name: 'LƯU PHIẾU NHẬP' }).click();

    // Đợi thông báo thành công (Sonner toast)
    await expect(page.getByText('Đã lưu phiếu nhập!')).toBeVisible({ timeout: 10000 });
  });

  test('Điều hướng sang trang Lịch sử', async ({ page }) => {
    await page.getByRole('link', { name: 'Lịch sử' }).click();
    
    // Chờ trang lịch sử load
    await expect(page).toHaveURL(/.*history/);
    await expect(page.getByText('Lịch sử nhập liệu')).toBeVisible();
    await expect(page.getByPlaceholder('Tìm theo tên hàng, nhà cung cấp, ghi chú...')).toBeVisible();
  });
});
