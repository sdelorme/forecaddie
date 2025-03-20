/**
 * PGA Tour tournaments dates are provided in Eastern Time.
 * Tournaments "go live" at 6:00 AM Eastern Time on their start date.
 */

/**
 * Standard tournament duration in days
 * Most tournaments run Thursday-Sunday (4 days)
 * but can extend to Monday or Tuesday due to weather/playoffs
 */
export const STANDARD_TOURNAMENT_DAYS = 4

/**
 * Converts an Eastern Time date string to a tournament start date with the correct start time
 * @param dateString Format: "YYYY-MM-DD" in Eastern Time
 */
export function getTournamentStartDate(dateString: string): Date {
  // Create date in ET by appending timezone
  const etDate = new Date(`${dateString}T06:00:00-04:00`)
  // Convert to UTC for internal handling
  return new Date(etDate.getTime())
}

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
