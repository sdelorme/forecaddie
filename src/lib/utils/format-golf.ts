export function formatPosition(pos: number | null): string {
  if (pos === null) return '—'
  if (pos === 1) return '1st'
  if (pos === 2) return '2nd'
  if (pos === 3) return '3rd'
  return `T${pos}`
}

export function formatEarnings(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatEventDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00Z`)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}
