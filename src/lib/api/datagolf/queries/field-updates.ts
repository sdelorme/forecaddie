import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import { RawFieldUpdatesResponseSchema } from '../schemas/field-updates'
import { normalizeFieldUpdates } from '../mappers/field-updates'
import type { FieldUpdate } from '@/types/field-updates'

export async function getFieldUpdates(): Promise<FieldUpdate | null> {
  try {
    const response = await dataGolfClient<unknown>(ENDPOINTS.FIELD_UPDATES, {
      revalidate: REVALIDATE_INTERVALS.FIELD_UPDATES,
      tags: [CACHE_TAGS.FIELD_UPDATES],
      params: {
        tour: 'pga',
        file_format: 'json'
      }
    })

    const parsed = RawFieldUpdatesResponseSchema.safeParse(response)
    if (!parsed.success) {
      console.error('Invalid field updates response:', parsed.error.format())
      return null
    }

    return normalizeFieldUpdates(parsed.data)
  } catch (error) {
    console.error('Error fetching field updates:', error)
    return null
  }
}
