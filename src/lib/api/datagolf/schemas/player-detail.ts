import { z } from 'zod'

export const RawDgRankingSchema = z
  .object({
    dg_id: z.number(),
    player_name: z.string()
  })
  .passthrough()

export const RawDgRankingsResponseSchema = z
  .object({
    rankings: z.array(RawDgRankingSchema)
  })
  .passthrough()

export const RawSkillRatingSchema = z
  .object({
    dg_id: z.number(),
    player_name: z.string()
  })
  .passthrough()

export const RawSkillRatingsResponseSchema = z
  .object({
    players: z.array(RawSkillRatingSchema)
  })
  .passthrough()

export const RawEventResultSchema = z
  .object({
    dg_id: z.number()
  })
  .passthrough()

export const RawEventResultsResponseSchema = z.array(RawEventResultSchema)

export const RawEventListItemSchema = z
  .object({
    event_id: z.number()
  })
  .passthrough()

export const RawEventListResponseSchema = z.array(RawEventListItemSchema)
