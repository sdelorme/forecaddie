// Map of normalized player names to their image paths
const PLAYER_IMAGES: Record<string, string> = {}

// Default image that we know exists in the project
const DEFAULT_PLAYER_IMAGE = '/homa-no-bg.png'

// Normalize player name for consistent lookup
function normalizePlayerName(name: string): string {
  return name.toLowerCase().trim()
}

// Get player image URL with fallback
export function getPlayerImageUrl(playerName: string): string {
  const normalizedName = normalizePlayerName(playerName)
  return PLAYER_IMAGES[normalizedName] || DEFAULT_PLAYER_IMAGE
}

// Preload all player images for better performance
export function preloadPlayerImages(): void {
  if (typeof window !== 'undefined') {
    Object.values(PLAYER_IMAGES).forEach((url) => {
      const img = new Image()
      img.src = url
    })
  }
}

// Check if we need to fetch/update player images
export function getMissingPlayerImages(playerNames: string[]): string[] {
  return playerNames.filter((name) => !PLAYER_IMAGES[normalizePlayerName(name)])
}
