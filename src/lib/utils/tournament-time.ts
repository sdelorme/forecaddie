/**
 * PGA Tour tournaments dates are provided in Eastern Time.
 * Tournament types are determined by their start date:
 * - Future: Starts after today (in ET)
 * - Live: Most recent tournament that isn't in the future
 * - Historical: Any past tournament that isn't the most recent
 */

const EASTERN_TIMEZONE = 'America/New_York'

/**
 * Gets the UTC offset for Eastern Time on a given date, accounting for DST
 * @param date The date to check
 * @returns Offset string like "-05:00" (EST) or "-04:00" (EDT)
 */
function getEasternOffset(date: Date): string {
  // Format a date in Eastern time and extract the offset
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: EASTERN_TIMEZONE,
    timeZoneName: 'shortOffset'
  })

  const parts = formatter.formatToParts(date)
  const offsetPart = parts.find((p) => p.type === 'timeZoneName')
  const offsetStr = offsetPart?.value || 'GMT-5'

  // Convert "GMT-5" or "GMT-4" to "-05:00" or "-04:00"
  const match = offsetStr.match(/GMT([+-])(\d+)/)
  if (match) {
    const sign = match[1]
    const hours = match[2].padStart(2, '0')
    return `${sign}${hours}:00`
  }

  // Fallback to EST if parsing fails
  return '-05:00'
}

/**
 * Converts an Eastern Time date string to a tournament start date with the correct start time
 * @param dateString Format: "YYYY-MM-DD" in Eastern Time
 * @returns Date object in UTC representing 5am ET on the given date
 */
export function getTournamentStartDate(dateString: string): Date {
  // First, create a rough date to determine DST status
  const roughDate = new Date(`${dateString}T12:00:00Z`)
  const offset = getEasternOffset(roughDate)

  // Create date in ET with correct offset
  const etDate = new Date(`${dateString}T05:00:00${offset}`)
  return new Date(etDate.getTime())
}

/**
 * Formats a tournament date string for display in the local timezone
 * @param dateString Format: "YYYY-MM-DD" in Eastern Time
 * @returns Localized date string
 */
export function formatTournamentDate(dateString: string): string {
  const date = getTournamentStartDate(dateString)
  return date.toLocaleDateString()
}

/**
 * Standard tournament duration in days
 * Most tournaments run Thursday-Sunday (4 days)
 * but can extend to Monday or Tuesday due to weather/playoffs
 */
export const STANDARD_TOURNAMENT_DAYS = 4

/**
 * Gets the expected end date for a tournament
 * Sets to 11:59:59.999 PM ET on the final day
 */
export function getTournamentEndDate(dateString: string): Date {
  const startDate = getTournamentStartDate(dateString)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + STANDARD_TOURNAMENT_DAYS)
  // Set to midnight ET of the next day
  endDate.setHours(28, 0, 0, 0) // 28 hours = next day 4am UTC = midnight ET
  return endDate
}

/**
 * Checks if a tournament is currently in progress
 */
export function isTournamentInProgress(startDateString: string, currentDate: Date): boolean {
  const startDate = getTournamentStartDate(startDateString)
  const endDate = getTournamentEndDate(startDateString)
  return currentDate >= startDate && currentDate <= endDate
}

/**
 * Checks if a tournament has completed
 */
export function isTournamentComplete(startDateString: string, currentDate: Date): boolean {
  const endDate = getTournamentEndDate(startDateString)
  return currentDate > endDate
}
