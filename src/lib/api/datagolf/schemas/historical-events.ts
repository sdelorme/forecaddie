import { z } from 'zod'

export const RawHistoricalEventSchema = z.object({
  calendar_year: z.number(),
  date: z.string(),
  event_id: z.number(),
  event_name: z.string(),
  tour: z.string()
})

export const RawHistoricalEventListSchema = z.array(RawHistoricalEventSchema)

export const RawHistoricalEventResultSchema = z.object({
  dg_id: z.number(),
  player_name: z.string(),
  fin_text: z.string(),
  earnings: z.number().optional().nullable(),
  fec_points: z.number().optional().nullable(),
  dg_points: z.number().optional().nullable()
})

export const RawHistoricalEventResultsResponseSchema = z.object({
  event_completed: z.string(),
  tour: z.string(),
  season: z.number(),
  year: z.number(),
  event_name: z.string(),
  event_id: z.coerce.number(),
  event_stats: z.array(RawHistoricalEventResultSchema)
})

export type RawHistoricalEventFromSchema = z.infer<typeof RawHistoricalEventSchema>
export type RawHistoricalEventResultFromSchema = z.infer<typeof RawHistoricalEventResultSchema>
export type RawHistoricalEventResultsResponseFromSchema = z.infer<typeof RawHistoricalEventResultsResponseSchema>
