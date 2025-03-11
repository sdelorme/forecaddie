export const ENDPOINTS = {
  LIVE_STATS: '/preds/live-tournament-stats',
  LIVE_PREDICTIONS: '/preds/in-play',
  SCHEDULE: '/get-schedule',
  PLAYERS: '/get-player-list'
} as const

export const CACHE_TAGS = {
  LIVE: 'live-data',
  SCHEDULE: 'schedule',
  PLAYERS: 'players'
} as const

export const REVALIDATE_INTERVALS = {
  LIVE_ACTIVE: 300, // 5 minutes
  SCHEDULE: 604800, // 1 week
  PLAYERS: 86400 // 24 hours
} as const

export const BASE_URL = 'https://feeds.datagolf.com'
