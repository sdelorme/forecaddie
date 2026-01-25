import { createClient } from './client'

/**
 * Register or update the current user's device in Supabase.
 * Requires an authenticated session - returns the device ID if successful.
 * This replaces the old anonymous device-id flow.
 */
export async function registerUserDevice(): Promise<string | null> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Check if user already has a device record
  const { data: existingDevice } = await supabase.from('devices').select('id').eq('user_id', user.id).single()

  if (existingDevice) {
    // Update last_seen_at
    await supabase.from('devices').update({ last_seen_at: new Date().toISOString() }).eq('id', existingDevice.id)

    return existingDevice.id
  }

  // Create new device for user
  const { data, error } = await supabase.from('devices').insert({ user_id: user.id }).select('id').single()

  if (error) {
    console.error('Failed to create device:', error)
    return null
  }

  return data.id
}

/**
 * Get the current user's device ID if they have one.
 */
export async function getUserDeviceId(): Promise<string | null> {
  const supabase = createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data } = await supabase.from('devices').select('id').eq('user_id', user.id).single()

  return data?.id ?? null
}
