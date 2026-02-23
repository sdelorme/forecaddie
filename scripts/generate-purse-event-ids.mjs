#!/usr/bin/env node
/**
 * Fetches PGA schedule and generates TOURNAMENT_PURSES_BY_EVENT_ID from schedule + BY_NAME.
 * Run: DATA_GOLF_API_KEY=xxx node scripts/generate-purse-event-ids.mjs
 * Paste output into src/data/tournament-purses.ts TOURNAMENT_PURSES_BY_EVENT_ID.
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pursesPath = join(__dirname, '../src/data/tournament-purses.ts')
const src = readFileSync(pursesPath, 'utf8')
const byNameMatch = src.match(/TOURNAMENT_PURSES_BY_NAME: Record<string, number> = ({[\s\S]*?})\s*\n/)
if (!byNameMatch) {
  console.error('Could not parse TOURNAMENT_PURSES_BY_NAME')
  process.exit(1)
}
const byNameStr = byNameMatch[1]
const byName = {}
for (const m of byNameStr.matchAll(/'([^']+)':\s*([\d_]+)/g)) {
  byName[m[1]] = Number(m[2].replace(/_/g, ''))
}

const key = process.env.DATA_GOLF_API_KEY
if (!key) {
  console.error('Set DATA_GOLF_API_KEY')
  process.exit(1)
}
const res = await fetch('https://feeds.datagolf.com/get-schedule?key=' + key + '&tour=pga')
const data = await res.json()
const schedule = data?.schedule ?? []

const entries = []
for (const e of schedule) {
  const purse = byName[e.event_name]
  if (purse != null) {
    entries.push(`  '${e.event_id}': ${purse.toLocaleString('en-US').replace(/,/g, '_')}`)
  }
}
console.log('export const TOURNAMENT_PURSES_BY_EVENT_ID: Record<string, number> = {')
console.log(entries.join(',\n'))
console.log('}')
