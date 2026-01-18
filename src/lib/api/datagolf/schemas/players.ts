import { z } from 'zod'

export const RawPlayerSchema = z.object({
  amateur: z.number(), // 0 = professional, 1 = amateur
  country: z.string(),
  country_code: z.string(),
  dg_id: z.number(),
  player_name: z.string()
})

export const RawPlayerListResponseSchema = z.array(RawPlayerSchema)

export type RawPlayerFromSchema = z.infer<typeof RawPlayerSchema>
