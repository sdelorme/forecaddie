import { z } from 'zod'

export const RawTourEventSchema = z.object({
  country: z.string(),
  course: z.string(),
  course_key: z.string(),
  event_id: z.string(),
  event_name: z.string(),
  latitude: z.number(),
  location: z.string(),
  longitude: z.number(),
  start_date: z.string(),
  status: z.enum(['upcoming', 'in_progress', 'completed']),
  tour: z.string(),
  winner: z.string()
})

export const RawTourScheduleSchema = z.object({
  tour: z.string(),
  season: z.number(),
  schedule: z.array(RawTourEventSchema)
})

export type RawTourEventFromSchema = z.infer<typeof RawTourEventSchema>
export type RawTourScheduleFromSchema = z.infer<typeof RawTourScheduleSchema>
