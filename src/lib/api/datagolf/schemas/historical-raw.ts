import { z } from 'zod'

export const RawHistoricalRawEventSchema = z.object({
  calendar_year: z.number(),
  date: z.string(),
  event_id: z.number(),
  event_name: z.string(),
  sg_categories: z.string(),
  traditional_stats: z.string(),
  tour: z.string()
})

export const RawHistoricalRawEventListSchema = z.array(RawHistoricalRawEventSchema)

const RawRoundDataSchema = z
  .object({
    score: z.number(),
    course_name: z.string(),
    course_par: z.number(),
    sg_total: z.number().nullable().optional(),
    sg_ott: z.number().nullable().optional(),
    sg_app: z.number().nullable().optional(),
    sg_arg: z.number().nullable().optional(),
    sg_putt: z.number().nullable().optional(),
    sg_t2g: z.number().nullable().optional(),
    driving_acc: z.number().nullable().optional(),
    driving_dist: z.number().nullable().optional(),
    gir: z.number().nullable().optional(),
    scrambling: z.number().nullable().optional(),
    birdies: z.number().nullable().optional(),
    bogies: z.number().nullable().optional(),
    pars: z.number().nullable().optional(),
    great_shots: z.number().nullable().optional(),
    poor_shots: z.number().nullable().optional(),
    prox_fw: z.number().nullable().optional(),
    prox_rgh: z.number().nullable().optional(),
    start_hole: z.number().nullable().optional(),
    teetime: z.string().nullable().optional()
  })
  .passthrough()

const RawHistoricalRawScoreSchema = z.object({
  dg_id: z.number(),
  player_name: z.string(),
  fin_text: z.string(),
  round_1: RawRoundDataSchema.nullable().optional(),
  round_2: RawRoundDataSchema.nullable().optional(),
  round_3: RawRoundDataSchema.nullable().optional(),
  round_4: RawRoundDataSchema.nullable().optional()
})

export const RawHistoricalRawRoundsResponseSchema = z.object({
  event_name: z.string(),
  event_id: z.coerce.string(),
  tour: z.string(),
  event_completed: z.string(),
  year: z.number(),
  season: z.number(),
  sg_categories: z.string(),
  scores: z.array(RawHistoricalRawScoreSchema)
})

export type RawHistoricalRawEventFromSchema = z.infer<typeof RawHistoricalRawEventSchema>
export type RawHistoricalRawRoundsResponseFromSchema = z.infer<typeof RawHistoricalRawRoundsResponseSchema>
