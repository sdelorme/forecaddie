import { Suspense } from 'react'
import OddsTable from './(components)/odds-table'
import { NormalizedOddsData } from '@/lib/api/datagolf/types/odds'
import { getOutrightOdds } from '@/lib/api/datagolf/queries/odds'

export default async function OddsPage() {
  const oddsData: NormalizedOddsData = await getOutrightOdds()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">{oddsData.eventName} Tournament Odds</h1>
      <Suspense
        fallback={
          <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        }
      >
        <OddsTable odds={oddsData} />
      </Suspense>
    </main>
  )
}
