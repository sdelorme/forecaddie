import { z } from 'zod'

export const RawFieldPlayerSchema = z.object({
  am: z.number(),
  country: z.string(),
  dg_id: z.number(),
  dk_id: z.string().nullable().optional(),
  dk_salary: z.number().nullable().optional(),
  early_late: z.number().nullable().optional(),
  fd_id: z.string().nullable().optional(),
  fd_salary: z.number().nullable().optional(),
  player_name: z.string(),
  r1_teetime: z.string().nullable().optional(),
  start_hole: z.number().nullable().optional()
})

export const RawFieldUpdatesResponseSchema = z.object({
  course_name: z.string(),
  current_round: z.number(),
  event_name: z.string(),
  field: z.array(RawFieldPlayerSchema)
})

export type RawFieldPlayerFromSchema = z.infer<typeof RawFieldPlayerSchema>
export type RawFieldUpdatesResponseFromSchema = z.infer<typeof RawFieldUpdatesResponseSchema>
