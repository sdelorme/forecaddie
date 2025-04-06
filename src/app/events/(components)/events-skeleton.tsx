export function EventsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4 h-full">
          <div className="flex justify-between items-start mb-2">
            <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-4 w-1/2 bg-gray-700 rounded mb-2 animate-pulse" />
          <div className="h-3 w-1/3 bg-gray-700 rounded mt-auto animate-pulse" />
        </div>
      ))}
    </div>
  )
}
