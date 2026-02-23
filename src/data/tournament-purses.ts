/**
 * Hardcoded PGA Tour purse (prize money) by event.
 * Primary: event_id (from schedule). Fallback: event name.
 * Source: PGA Tour 2025 purse data. Update annually.
 */
export const TOURNAMENT_PURSES_BY_EVENT_ID: Record<string, number> = {}

export const TOURNAMENT_PURSES_BY_NAME: Record<string, number> = {
  'The Sentry': 20_000_000,
  'Sony Open in Hawaii': 8_300_000,
  'The American Express': 8_400_000,
  'Farmers Insurance Open': 9_000_000,
  'AT&T Pebble Beach Pro-Am': 20_000_000,
  'Waste Management Phoenix Open': 8_800_000,
  'The Genesis Invitational': 20_000_000,
  'Mexico Open at Vidanta': 8_100_000,
  'Cognizant Classic in the Palm Beaches': 9_000_000,
  'Arnold Palmer Invitational': 20_000_000,
  'Puerto Rico Open': 4_000_000,
  'The Players Championship': 25_000_000,
  'Valspar Championship': 8_400_000,
  "Texas Children's Houston Open": 9_100_000,
  'Valero Texas Open': 9_200_000,
  'Masters Tournament': 21_000_000,
  'RBC Heritage': 20_000_000,
  'Corales Puntacana Championship': 4_000_000,
  'Zurich Classic of New Orleans': 8_900_000,
  'The CJ Cup Byron Nelson': 9_500_000,
  'Truist Championship': 20_000_000,
  'Myrtle Beach Classic': 4_000_000,
  'PGA Championship': 19_000_000,
  'Charles Schwab Challenge': 9_100_000,
  'the Memorial Tournament': 20_000_000,
  'The Memorial Tournament': 20_000_000,
  'RBC Canadian Open': 9_400_000,
  'U.S. Open': 21_500_000,
  'Travelers Championship': 20_000_000,
  'Rocket Mortgage Classic': 9_200_000,
  'John Deere Classic': 7_800_000,
  'Genesis Scottish Open': 9_000_000,
  'ISCO Championship': 4_000_000,
  'The Open Championship': 17_000_000,
  'Barracuda Championship': 4_000_000,
  '3M Open': 8_300_000,
  'Wyndham Championship': 7_900_000,
  'FedEx St. Jude Championship': 20_000_000,
  'BMW Championship': 20_000_000,
  'Tour Championship': 40_000_000,
  'Procore Championship': 6_000_000,
  'Sanderson Farms Championship': 6_000_000,
  'Baycurrent Classic': 8_500_000,
  'Black Desert Championship': 6_000_000,
  'World Wide Technology Championship': 6_000_000,
  'Butterfield Bermuda Championship': 6_000_000,
  'The RSM Classic': 6_000_000
}

/**
 * Lookup purse for an event. Tries event_id first, then event name. Returns undefined if not found.
 */
export function getPurseForEvent(eventId: string, eventName?: string): number | undefined {
  const byId = TOURNAMENT_PURSES_BY_EVENT_ID[eventId]
  if (byId != null) return byId
  if (eventName) return TOURNAMENT_PURSES_BY_NAME[eventName]
  return undefined
}

/**
 * Format purse for display: $20M, $2.5M, $800K, etc.
 */
export function formatPurse(purse: number): string {
  if (purse >= 1_000_000) {
    const millions = purse / 1_000_000
    return millions % 1 === 0 ? `$${millions}M` : `$${millions.toFixed(1)}M`
  }
  if (purse >= 1_000) {
    const thousands = purse / 1_000
    return thousands % 1 === 0 ? `$${thousands}K` : `$${thousands.toFixed(1)}K`
  }
  return `$${purse.toLocaleString('en-US')}`
}
