export default function EventDetailLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-4 w-28 bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="h-8 w-72 bg-gray-700 rounded mb-2 animate-pulse" />
        <div className="flex gap-4 mt-2">
          <div className="h-4 w-40 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-20 bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="bg-gray-800/50 rounded-lg overflow-hidden">
        <div className="border-b border-gray-700/50 px-4 py-3 flex gap-4">
          <div className="h-4 w-10 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-700 rounded animate-pulse ml-auto" />
        </div>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="border-b border-gray-700/30 px-4 py-2.5 flex gap-4">
            <div className="h-4 w-8 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse ml-auto" />
          </div>
        ))}
      </div>
    </main>
  )
}
