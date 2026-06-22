export default function Home() {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-md mx-auto space-y-4 bg-surface-base text-ink-primary p-6 rounded-2xl shadow-sm border border-primary-100">
        <h1 className="text-2xl font-bold text-primary-700">Nhập Liệu Quán Cafe</h1>
        <p className="text-primary-700">Design Tokens Test:</p>
        <div className="p-4 rounded-xl bg-primary-50 border border-primary-200">
          <p className="text-primary-900 font-medium">Test numbers (tabular-nums):</p>
          <p className="text-2xl mt-2">1,234,567.89 ₫</p>
          <p className="text-2xl">1,111,111.11 ₫</p>
        </div>
      </div>
    </main>
  );
}
