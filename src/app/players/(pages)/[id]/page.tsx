export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const playerId = (await params).id

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Player {playerId}</h1>
      <p className="text-gray-400">Player details coming soon...</p>
    </div>
  )
}
