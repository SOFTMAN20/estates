export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          cancellation_date: string | null
          created_at: string | null
          end_date: string
          id: string
          payment_method: string | null
          payment_status: string | null
          property_id: string
          start_date: string
          status: string | null
          total_price: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancellation_date?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          property_id: string
          start_date: string
          status?: string | null
          total_price: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancellation_date?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          property_id?: string
          start_date?: string
          status?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          amenities: string[] | null
          approved_at: string | null
          approved_by: string | null
          available_from: string | null
          bathrooms: number
          bedrooms: number
          contact_phone: string | null
          contact_whatsapp_phone: string | null
          created_at: string | null
          description: string
          full_address: string | null
          host_id: string
          id: string
          images: string[]
          location: string
          nearby_services: string[] | null
          price: number
          price_period: string | null
          property_type: string
          rejection_reason: string | null
          reviewed_at: string | null
          square_meters: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          available_from?: string | null
          bathrooms: number
          bedrooms: number
          contact_phone?: string | null
          contact_whatsapp_phone?: string | null
          created_at?: string | null
          description: string
          full_address?: string | null
          host_id: string
          id?: string
          images?: string[]
          location: string
          nearby_services?: string[] | null
          price: number
          price_period?: string | null
          property_type: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          square_meters?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          available_from?: string | null
          bathrooms?: number
          bedrooms?: number
          contact_phone?: string | null
          contact_whatsapp_phone?: string | null
          created_at?: string | null
          description?: string
          full_address?: string | null
          host_id?: string
          id?: string
          images?: string[]
          location?: string
          nearby_services?: string[] | null
          price?: number
          price_period?: string | null
          property_type?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          square_meters?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      property_addresses: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          district: string | null
          full_address: string | null
          id: string
          latitude: number | null
          longitude: number | null
          postal_code: string | null
          property_id: string
          region: string | null
          street: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          district?: string | null
          full_address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          property_id: string
          region?: string | null
          street?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          district?: string | null
          full_address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          property_id?: string
          region?: string | null
          street?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_addresses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          is_host: boolean | null
          is_suspended: boolean | null
          location: string | null
          name: string | null
          phone: string | null
          profile_completed: boolean | null
          role: string | null
          suspension_reason: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id: string
          is_host?: boolean | null
          is_suspended?: boolean | null
          location?: string | null
          name?: string | null
          phone?: string | null
          profile_completed?: boolean | null
          role?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_host?: boolean | null
          is_suspended?: boolean | null
          location?: string | null
          name?: string | null
          phone?: string | null
          profile_completed?: boolean | null
          role?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      booking_stats: {
        Row: {
          average_booking_value: number | null
          cancelled_bookings: number | null
          completed_bookings: number | null
          confirmed_bookings: number | null
          pending_bookings: number | null
          total_bookings: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
