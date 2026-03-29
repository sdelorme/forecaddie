export const ENDPOINTS = {
  LIVE_STATS: '/preds/live-tournament-stats',
  LIVE_PREDICTIONS: '/preds/in-play',
  SCHEDULE: '/get-schedule',
  PLAYERS: '/get-player-list',
  OUTRIGHT_ODDS: '/betting-tools/outrights',
  DG_RANKINGS: '/preds/get-dg-rankings',
  SKILL_RATINGS: '/preds/skill-ratings',
  EVENT_LIST: '/historical-event-data/event-list',
  HISTORICAL_EVENT_RESULTS: '/historical-event-data/events',
  RAW_EVENT_LIST: '/historical-raw-data/event-list',
  RAW_ROUNDS: '/historical-raw-data/rounds',
  FIELD_UPDATES: '/field-updates'
} as const

export const CACHE_TAGS = {
  LIVE: 'live-data',
  SCHEDULE: 'schedule',
  PLAYERS: 'players',
  ODDS: 'odds',
  RANKINGS: 'rankings',
  PLAYER_HISTORY: 'player-history',
  HISTORICAL_EVENT_LIST: 'historical-event-list',
  HISTORICAL_EVENT_RESULTS: 'historical-event-results',
  RAW_EVENT_LIST: 'raw-event-list',
  RAW_ROUNDS: 'raw-rounds',
  FIELD_UPDATES: 'field-updates'
} as const

export const REVALIDATE_INTERVALS = {
  LIVE_ACTIVE: 300, // 5 minutes
  SCHEDULE: 3600, // 1 hour — status transitions (upcoming → in_progress → completed) need timely refresh
  PLAYERS: 86400, // 24 hours
  ODDS: 3600, // 1 hour
  RANKINGS: 86400, // 24 hours
  PLAYER_HISTORY: 604800, // 1 week
  HISTORICAL_EVENT_LIST: 604800, // 1 week
  HISTORICAL_EVENT_RESULTS: 604800, // 1 week — historical data doesn't change
  RAW_EVENT_LIST: 604800, // 1 week
  RAW_ROUNDS: 604800, // 1 week — historical data doesn't change
  FIELD_UPDATES: 3600 // 1 hour
} as const

export const BASE_URL = 'https://feeds.datagolf.com'

export const CLIENT_CONFIG = {
  TIMEOUT_MS: 10000, // 10 second timeout per request
  MAX_RETRIES: 2, // Up to 3 total attempts (initial + 2 retries)
  RETRY_DELAY_MS: 300 // Base delay, doubles each retry (300ms, 600ms)
} as const
