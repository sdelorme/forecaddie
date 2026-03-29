import { z } from 'zod'

export const CreatePlanSchema = z.object({
  name: z.string().trim().min(1, 'Plan name is required').max(100, 'Plan name must be 100 characters or fewer'),
  season: z.number().int().optional()
})

export const UpdatePlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Plan name must be a non-empty string')
    .max(100, 'Plan name must be 100 characters or fewer')
    .optional(),
  season: z.number().int().optional(),
  hidden_events: z.array(z.string().max(100)).max(200, 'Too many hidden events').optional()
})

export const CreatePickSchema = z.object({
  event_id: z.string().min(1, 'event_id is required').max(100, 'event_id is too long'),
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
    .max(320, 'Email is too long')
    .email('Valid email is required')
    .transform((s) => s.toLowerCase().trim()),
  role: z.enum(['editor', 'viewer']).optional().default('editor')
})

export const CreateCommentSchema = z.object({
  event_id: z.string().min(1, 'event_id is required').max(100, 'event_id is too long'),
  body: z.string().min(1, 'Comment body is required').max(2000, 'Comment must be 2000 characters or fewer'),
  parent_id: z.string().uuid().nullable().optional()
})

export const UpdateCommentSchema = z.object({
  body: z.string().min(1, 'Comment body is required').max(2000, 'Comment must be 2000 characters or fewer')
})

export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be 20 characters or fewer')
    .regex(/^[a-z0-9][a-z0-9_]*[a-z0-9]$/, 'Username can only contain lowercase letters, numbers, and underscores')
})

export const UpsertPurseSchema = z.object({
  dg_event_id: z.string().min(1, 'dg_event_id is required').max(100, 'dg_event_id is too long'),
  season: z.number().int().min(2020).max(2100),
  event_name: z.string().min(1, 'event_name is required').max(200, 'event_name is too long'),
  purse: z.number().int().positive('Purse must be a positive number').max(100_000_000, 'Purse amount is unrealistic')
})
