/**
 * Supabase type re-exports and convenience aliases.
 *
 * The raw Database interface lives in `types.generated.ts` and is overwritten
 * by `pnpm db:gen-types`. Hand-written convenience aliases live here so they
 * survive regeneration.
 */

// Re-export generated types so existing imports keep working
export type { Database, Json } from './types.generated'

import type { Database } from './types.generated'

// Convenience types for working with rows
export type Device = Database['public']['Tables']['devices']['Row']
export type SeasonPlan = Database['public']['Tables']['season_plans']['Row']
export type Pick = Database['public']['Tables']['picks']['Row']
export type PlayerFlag = Database['public']['Tables']['player_flags']['Row']

// Insert types
export type DeviceInsert = Database['public']['Tables']['devices']['Insert']
export type SeasonPlanInsert = Database['public']['Tables']['season_plans']['Insert']
export type PickInsert = Database['public']['Tables']['picks']['Insert']
export type PlayerFlagInsert = Database['public']['Tables']['player_flags']['Insert']

// Update types
export type SeasonPlanUpdate = Database['public']['Tables']['season_plans']['Update']
export type PickUpdate = Database['public']['Tables']['picks']['Update']
export type PlayerFlagUpdate = Database['public']['Tables']['player_flags']['Update']
