-- Kích hoạt extension unaccent để tìm kiếm không dấu
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Tạo bảng entries
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  quantity NUMERIC CHECK (quantity > 0),
  unit TEXT,
  supplier TEXT,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  method TEXT NOT NULL,
  note TEXT,
  created_by TEXT NOT NULL,
  corrected_by TEXT,
  correction_for_id UUID REFERENCES entries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT check_no_self_correction CHECK (id != correction_for_id)
);

-- Kích hoạt Row Level Security
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Policy: Cho phép tất cả mọi người đọc (SELECT) để hiển thị danh sách
CREATE POLICY "Enable read access for all users" 
ON entries FOR SELECT 
TO public 
USING (true);

-- LƯU Ý: 
-- KHÔNG CÓ POLICY CHO INSERT, UPDATE, DELETE.
-- Việc ghi đè sẽ được thực hiện qua backend sử dụng Service Role (bỏ qua RLS).
-- Mọi truy cập trực tiếp từ phía client (như browser, postman) bằng anon key sẽ bị từ chối INSERT.
