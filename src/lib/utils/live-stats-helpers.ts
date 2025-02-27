export const formatPlayerScore = (score: number | null): string => {
  if (score === undefined || score === null || isNaN(score)) {
    return '-' // Placeholder if score is missing or invalid
  }

  return score === 0 ? 'E' : score > 0 ? `+${score}` : `${score}`
}

export const getScoreStyle = (
  score: string,
  type: 'text' | 'bg' = 'text'
): string => {
  if (score === 'E') return type === 'text' ? 'text-gray-400' : 'bg-gray-400' // Neutral for Even
  if (Number(score) < 0)
    return type === 'text' ? 'text-green-500' : 'bg-red-500' // Negative scores
  return type === 'text' ? 'text-red-500' : 'bg-green-500' // Positive scores and '-'
}

export const formatPlayerThru = (thru: number): string => {
  return thru === 0 ? '-' : thru.toString()
}

export const compareScores = (a: number | null, b: number | null): number => {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return a - b
}

export const decimalToPercent = (value: number): number => {
  return parseFloat((value * 100).toFixed(2))
}
