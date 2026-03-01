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
  player_dg_id: z.number().int().nullable().optional(),
  slot: z
    .union([z.literal(1), z.literal(2), z.literal(3)])
    .optional()
    .default(1)
})

export const UpdatePickSchema = z.object({
  player_dg_id: z.number().int().nullable(),
  slot: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional()
})

export const PlanMemberRole = z.enum(['owner', 'editor', 'viewer'])
export type PlanMemberRole = z.infer<typeof PlanMemberRole>

export const InvitePlanSchema = z.object({
  email: z
    .string()
    .email('Valid email is required')
    .transform((s) => s.toLowerCase().trim()),
  role: z.enum(['editor', 'viewer']).optional().default('editor')
})
