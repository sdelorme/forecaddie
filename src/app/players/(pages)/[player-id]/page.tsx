export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ 'player-id': string }>
}) {
  // Await the params to resolve
  const resolvedParams = await params
  const playerId = resolvedParams['player-id']

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Player with ID: {playerId}</h1>
      <p className="text-lg text-gray-700">
        More details about this player coming soon...
      </p>
    </div>
  )
}
