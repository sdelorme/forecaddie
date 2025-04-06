import OddsTable from './(components)/odds-table'
import { NormalizedOddsData } from '@/lib/api/datagolf/types/odds'
import { getOutrightOdds } from '@/lib/api/datagolf/queries/odds'

export default async function OddsPage() {
  const oddsData: NormalizedOddsData = await getOutrightOdds()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">{oddsData.eventName} Tournament Odds</h1>
      <OddsTable odds={oddsData} />
    </main>
  )
}
