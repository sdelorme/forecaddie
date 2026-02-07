export default function PlanDetailLoading() {
  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem-4rem)]">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-9 w-64 bg-gray-700 rounded animate-pulse" />
        <div className="h-5 w-32 bg-gray-800 rounded animate-pulse mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event list skeleton */}
        <div className="lg:col-span-1 space-y-2">
          <div className="h-6 w-24 bg-gray-700 rounded animate-pulse mb-3" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Player table skeleton */}
        <div className="lg:col-span-2">
          <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </div>
    </main>
  )
}
