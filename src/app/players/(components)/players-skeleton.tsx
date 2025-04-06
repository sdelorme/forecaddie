export function PlayersSkeleton() {
  return (
    <div>
      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-10 w-12 bg-gray-700 rounded animate-pulse" />
        <div className="h-10 w-48 bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Player List */}
      <div className="flex flex-col gap-1">
        {Array.from({ length: 3 }).map((_, letterIndex) => (
          <div key={letterIndex}>
            <div className="h-8 w-8 bg-gray-700 rounded mb-4 ml-4 animate-pulse" />
            {Array.from({ length: 3 }).map((_, playerIndex) => (
              <div key={playerIndex} className="w-full bg-gray-800">
                <div className="w-full flex items-center p-4">
                  <div className="w-16 h-16 rounded-full bg-gray-700 mr-4 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <div className="h-6 w-48 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-700 rounded mt-1 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
