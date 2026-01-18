import { z } from 'zod'

const DataGolfOddsValueSchema = z.object({
  baseline: z.string(),
  baseline_history_fit: z.string()
})

export const PlayerOddsSchema = z.object({
  bet365: z.string().optional(),
  betcris: z.string().optional(),
  betfair: z.string().optional(),
  betonline: z.string().optional(),
  betmgm: z.string().optional(),
  betway: z.string().optional(),
  bovada: z.string().optional(),
  caesars: z.string().optional(),
  datagolf: DataGolfOddsValueSchema,
  dg_id: z.number(),
  draftkings: z.string().optional(),
  fanduel: z.string().optional(),
  pinnacle: z.string().optional(),
  player_name: z.string(),
  pointsbet: z.string().optional(),
  skybet: z.string().optional(),
  unibet: z.string().optional(),
  williamhill: z.string().optional()
})

export const DataGolfOddsSchema = z.object({
  books_offering: z.array(z.string()),
  event_name: z.string(),
  last_updated: z.string(),
  market: z.string(),
  odds: z.array(PlayerOddsSchema)
})

export type DataGolfOddsFromSchema = z.infer<typeof DataGolfOddsSchema>
