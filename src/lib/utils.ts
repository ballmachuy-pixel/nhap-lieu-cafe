export function formatCurrency(value: string | number): string {
  if (!value) return "";
  const numberValue = typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) : value;
  if (isNaN(numberValue)) return "";
  return new Intl.NumberFormat("vi-VN").format(numberValue);
}

export function parseCurrency(value: string): number {
  if (!value) return 0;
  const parsed = parseInt(value.replace(/\D/g, ""), 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function getTodayStr(): string {
  // Trả về YYYY-MM-DD theo giờ local
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMinDateStr(daysAgo: number = 30): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
