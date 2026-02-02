export default function PlayerLoading() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col gap-6 md:flex-row md:items-center animate-pulse">
          <div className="w-28 h-28 rounded-full bg-gray-700" />
          <div className="space-y-3 flex-1">
            <div className="h-4 w-32 bg-gray-700 rounded" />
            <div className="h-6 w-64 bg-gray-700 rounded" />
            <div className="h-4 w-40 bg-gray-700 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
