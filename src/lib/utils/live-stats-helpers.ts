export const formatPlayerScore = (score: number): string => {
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
  return type === 'text' ? 'text-red-500' : 'bg-green-500' // Positive scores
}
