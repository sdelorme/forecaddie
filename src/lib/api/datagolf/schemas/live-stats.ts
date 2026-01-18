import { z } from 'zod'

export const RawLiveEventPlayerSchema = z.object({
  dg_id: z.number(),
  player_name: z.string(),
  position: z.string(),
  round: z.number(),
  sg_app: z.number().nullable(),
  sg_arg: z.number().nullable(),
  sg_ott: z.number().nullable(),
  sg_putt: z.number().nullable(),
  sg_t2g: z.number().nullable(),
  sg_total: z.number().nullable(),
  thru: z.union([z.string(), z.number()]).transform(String), // API may return number or "F"
  total: z.number()
})

export const RawLiveEventStatsSchema = z.object({
  course_name: z.string(),
  event_name: z.string(),
  last_updated: z.string(),
  stat_display: z.string(),
  stat_round: z.string(),
  live_stats: z.array(RawLiveEventPlayerSchema)
})

export const RawLiveModelPlayerSchema = z.object({
  R1: z.number().nullable(),
  R2: z.number().nullable(),
  R3: z.number().nullable(),
  R4: z.number().nullable(),
  country: z.string(),
  course: z.string(),
  current_pos: z.string(),
  current_score: z.number().nullable(),
  dg_id: z.number(),
  end_hole: z.number(),
  make_cut: z.number(),
  player_name: z.string(),
  round: z.number(),
  thru: z.union([z.string(), z.number()]).transform(String), // API may return number or "F"
  today: z.number(),
  top_10: z.number(),
  top_20: z.number(),
  top_5: z.number(),
  win: z.number()
})

export const RawLiveModelInfoSchema = z.object({
  current_round: z.number(),
  dead_heat_rules: z.string(),
  event_name: z.string(),
  last_update: z.string()
})

export const RawLiveModelSchema = z.object({
  data: z.array(RawLiveModelPlayerSchema),
  info: RawLiveModelInfoSchema
})

export type RawLiveEventStatsFromSchema = z.infer<typeof RawLiveEventStatsSchema>
export type RawLiveModelFromSchema = z.infer<typeof RawLiveModelSchema>
