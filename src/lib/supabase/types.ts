export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          id: string
          created_at: string
          last_seen_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          last_seen_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          last_seen_at?: string
        }
        Relationships: []
      }
      season_plans: {
        Row: {
          id: string
          device_id: string
          name: string
          season: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          device_id: string
          name: string
          season?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          device_id?: string
          name?: string
          season?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'season_plans_device_id_fkey'
            columns: ['device_id']
            isOneToOne: false
            referencedRelation: 'devices'
            referencedColumns: ['id']
          }
        ]
      }
      picks: {
        Row: {
          id: string
          plan_id: string
          event_id: string
          player_dg_id: number | null
          result_position: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          event_id: string
          player_dg_id?: number | null
          result_position?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          event_id?: string
          player_dg_id?: number | null
          result_position?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'picks_plan_id_fkey'
            columns: ['plan_id']
            isOneToOne: false
            referencedRelation: 'season_plans'
            referencedColumns: ['id']
          }
        ]
      }
      player_flags: {
        Row: {
          id: string
          device_id: string
          player_dg_id: number
          is_favorite: boolean
          is_flagged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          device_id: string
          player_dg_id: number
          is_favorite?: boolean
          is_flagged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          device_id?: string
          player_dg_id?: number
          is_favorite?: boolean
          is_flagged?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'player_flags_device_id_fkey'
            columns: ['device_id']
            isOneToOne: false
            referencedRelation: 'devices'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

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
