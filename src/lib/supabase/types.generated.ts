export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      devices: {
        Row: {
          created_at: string | null
          id: string
          last_seen_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      picks: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          plan_id: string
          player_dg_id: number | null
          result_position: number | null
          slot: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          plan_id: string
          player_dg_id?: number | null
          result_position?: number | null
          slot?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          plan_id?: string
          player_dg_id?: number | null
          result_position?: number | null
          slot?: number
          updated_at?: string | null
          user_id?: string
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
          created_at: string | null
          device_id: string | null
          event_id: string | null
          id: string
          is_favorite: boolean | null
          is_flagged: boolean | null
          player_dg_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          event_id?: string | null
          id?: string
          is_favorite?: boolean | null
          is_flagged?: boolean | null
          player_dg_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          event_id?: string | null
          id?: string
          is_favorite?: boolean | null
          is_flagged?: boolean | null
          player_dg_id?: number
          user_id?: string
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
      plan_members: {
        Row: {
          id: string
          plan_id: string
          user_id: string
          role: string
          created_at: string | null
        }
        Insert: {
          id?: string
          plan_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer'
          created_at?: string | null
        }
        Update: {
          id?: string
          plan_id?: string
          user_id?: string
          role?: 'owner' | 'editor' | 'viewer'
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'plan_members_plan_id_fkey'
            columns: ['plan_id']
            isOneToOne: false
            referencedRelation: 'season_plans'
            referencedColumns: ['id']
          }
        ]
      }
      tournament_purses: {
        Row: {
          id: string
          dg_event_id: string
          season: number
          event_name: string
          purse: number
          created_at: string | null
        }
        Insert: {
          id?: string
          dg_event_id: string
          season: number
          event_name: string
          purse: number
          created_at?: string | null
        }
        Update: {
          id?: string
          dg_event_id?: string
          season?: number
          event_name?: string
          purse?: number
          created_at?: string | null
        }
        Relationships: []
      }
      season_plans: {
        Row: {
          created_at: string | null
          device_id: string | null
          id: string
          name: string
          season: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          name: string
          season?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          name?: string
          season?: number
          updated_at?: string | null
          user_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_id_by_email: {
        Args: { user_email: string }
        Returns: string | null
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {}
  }
} as const
