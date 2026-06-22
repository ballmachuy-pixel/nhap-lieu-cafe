-- Tạo bảng users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL UNIQUE,
  pin TEXT NOT NULL,
  name TEXT NOT NULL
);

-- Thêm 2 tài khoản mặc định
INSERT INTO users (role, pin, name) VALUES 
  ('admin', '9999', 'Chủ quán'),
  ('staff', '1111', 'Nhân viên');

-- Kích hoạt RLS (Chỉ cho service role truy cập)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Không tạo Policy nào cho public, vì ta chỉ đọc bằng Service Role từ Server Actions
