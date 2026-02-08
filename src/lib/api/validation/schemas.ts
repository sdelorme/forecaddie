import { z } from 'zod'

export const CreatePlanSchema = z.object({
  name: z.string().trim().min(1, 'Plan name is required'),
  season: z.number().int().optional()
})

export const UpdatePlanSchema = z.object({
  name: z.string().trim().min(1, 'Plan name must be a non-empty string').optional(),
  season: z.number().int().optional()
})

export const CreatePickSchema = z.object({
  event_id: z.string().min(1, 'event_id is required'),
  player_dg_id: z.number().int().nullable().optional()
})

export const UpdatePickSchema = z.object({
  player_dg_id: z.number().int().nullable()
})
