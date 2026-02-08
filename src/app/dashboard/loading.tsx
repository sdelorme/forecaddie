export default function DashboardLoading() {
  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem-4rem)]">
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-700" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-800" />
          ))}
        </div>
      </div>
    </main>
  )
}
