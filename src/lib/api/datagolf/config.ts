export const ENDPOINTS = {
  LIVE_STATS: '/preds/live-tournament-stats',
  LIVE_PREDICTIONS: '/preds/in-play',
  SCHEDULE: '/get-schedule',
  PLAYERS: '/get-player-list',
  OUTRIGHT_ODDS: '/betting-tools/outrights',
  DG_RANKINGS: '/preds/get-dg-rankings',
  SKILL_RATINGS: '/preds/skill-ratings',
  EVENT_LIST: '/historical-raw-data/event-list',
  EVENT_RESULTS: '/historical-event-data/events'
} as const

export const CACHE_TAGS = {
  LIVE: 'live-data',
  SCHEDULE: 'schedule',
  PLAYERS: 'players',
  ODDS: 'odds',
  RANKINGS: 'rankings',
  PLAYER_HISTORY: 'player-history'
} as const

export const REVALIDATE_INTERVALS = {
  LIVE_ACTIVE: 300, // 5 minutes
  SCHEDULE: 604800, // 1 week
  PLAYERS: 86400, // 24 hours
  ODDS: 3600, // 1 hour
  RANKINGS: 86400, // 24 hours
  PLAYER_HISTORY: 604800 // 1 week
} as const

export const BASE_URL = 'https://feeds.datagolf.com'

export const CLIENT_CONFIG = {
  TIMEOUT_MS: 10000, // 10 second timeout per request
  MAX_RETRIES: 2, // Up to 3 total attempts (initial + 2 retries)
  RETRY_DELAY_MS: 300 // Base delay, doubles each retry (300ms, 600ms)
} as const
