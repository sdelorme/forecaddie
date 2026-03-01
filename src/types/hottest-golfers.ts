/**
 * Recent form data: dgId -> average finish position over last 5 completed PGA events.
 * Lower is better. CUT/WD/DQ count as 70. Requires minimum 2 valid finishes.
 */
export type RecentFormMap = Map<number, number>
