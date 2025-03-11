'use server'

import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '../config'

export async function revalidateLiveData() {
  revalidateTag(CACHE_TAGS.LIVE)
}

export async function revalidateSchedule() {
  revalidateTag(CACHE_TAGS.SCHEDULE)
}

export async function revalidatePlayers() {
  revalidateTag(CACHE_TAGS.PLAYERS)
}
