import { createClient } from './client'

const DEVICE_ID_KEY = 'forecaddie_device_id'

/**
 * Get or create a device ID for anonymous tracking.
 * Stores the ID in localStorage and ensures it exists in Supabase.
 */
export async function getOrCreateDeviceId(): Promise<string> {
  // Check localStorage first
  const existingId = localStorage.getItem(DEVICE_ID_KEY)

  if (existingId) {
    // Update last_seen_at in the background
    updateLastSeen(existingId)
    return existingId
  }

  // Create new device
  const supabase = createClient()
  const { data, error } = await supabase.from('devices').insert({}).select('id').single()

  if (error) {
    throw new Error(`Failed to create device: ${error.message}`)
  }

  // Store in localStorage
  localStorage.setItem(DEVICE_ID_KEY, data.id)
  return data.id
}

/**
 * Get device ID from localStorage without creating one.
 * Returns null if no device ID exists.
 */
export function getDeviceId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(DEVICE_ID_KEY)
}

/**
 * Update the last_seen_at timestamp for a device.
 * Called in the background when a returning device is detected.
 */
async function updateLastSeen(deviceId: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('devices').update({ last_seen_at: new Date().toISOString() }).eq('id', deviceId)
}

/**
 * Clear the device ID from localStorage.
 * Useful for testing or allowing users to "reset" their device.
 */
export function clearDeviceId(): void {
  localStorage.removeItem(DEVICE_ID_KEY)
}
