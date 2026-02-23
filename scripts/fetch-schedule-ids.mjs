#!/usr/bin/env node
/**
 * Fetches PGA schedule from DataGolf and outputs event_id|event_name for purse map.
 * Run: DATA_GOLF_API_KEY=xxx node scripts/fetch-schedule-ids.mjs
 */
const key = process.env.DATA_GOLF_API_KEY
if (!key) {
  console.error('Set DATA_GOLF_API_KEY')
  process.exit(1)
}
const url = 'https://feeds.datagolf.com/get-schedule?key=' + key + '&tour=pga'
const res = await fetch(url)
const data = await res.json()
const schedule = data?.schedule ?? []
for (const e of schedule) {
  console.log(e.event_id + '|' + e.event_name)
}
