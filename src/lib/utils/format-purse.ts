/**
 * Format purse for display: $20M, $9.1M, $800K, etc.
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
