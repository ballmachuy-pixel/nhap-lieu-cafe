-- Tạo hàm tìm kiếm Tên hàng hóa
-- Lấy giá trị mới nhất của hàng hóa dựa theo thời gian nhập (date DESC, created_at DESC)
CREATE OR REPLACE FUNCTION search_recent_items(search_term text)
RETURNS TABLE(name text, unit text, amount integer) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (e.name) e.name, e.unit, e.amount
  FROM entries e
  WHERE unaccent(e.name) ILIKE unaccent('%' || search_term || '%')
  ORDER BY e.name, e.date DESC, e.created_at DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo hàm tìm kiếm Nhà cung cấp
-- Chỉ cần trả về tên nhà cung cấp (mới nhất)
CREATE OR REPLACE FUNCTION search_recent_suppliers(search_term text)
RETURNS TABLE(supplier text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (e.supplier) e.supplier
  FROM entries e
  WHERE e.supplier IS NOT NULL 
    AND unaccent(e.supplier) ILIKE unaccent('%' || search_term || '%')
  ORDER BY e.supplier, e.date DESC, e.created_at DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
