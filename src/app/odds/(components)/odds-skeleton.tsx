export function OddsSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full">
      <div className="h-6 w-48 bg-gray-700 rounded mb-4 animate-pulse" />
      <div className="space-y-2 w-full">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 mb-4 w-full">
          <div className="h-6 bg-gray-700 rounded animate-pulse" />
          <div className="h-6 bg-gray-700 rounded animate-pulse" />
          <div className="h-6 bg-gray-700 rounded animate-pulse" />
          <div className="h-6 bg-gray-700 rounded animate-pulse" />
          <div className="h-6 bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Table Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 w-full">
            <div className="h-12 bg-gray-700 rounded animate-pulse" />
            <div className="h-12 bg-gray-700 rounded animate-pulse" />
            <div className="h-12 bg-gray-700 rounded animate-pulse" />
            <div className="h-12 bg-gray-700 rounded animate-pulse" />
            <div className="h-12 bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
