export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_id: string
          target_type: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id: string
          target_type: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          cancellation_date: string | null
          cancellation_reason: string | null
          check_in: string
          check_out: string
          created_at: string | null
          guest_id: string
          host_id: string
          id: string
          monthly_rent: number
          property_id: string
          service_fee: number
          special_requests: string | null
          status: string
          total_amount: number
          total_months: number
          updated_at: string | null
        }
        Insert: {
          cancellation_date?: string | null
          cancellation_reason?: string | null
          check_in: string
          check_out: string
          created_at?: string | null
          guest_id: string
          host_id: string
          id?: string
          monthly_rent: number
          property_id: string
          service_fee: number
          special_requests?: string | null
          status?: string
          total_amount: number
          total_months: number
          updated_at?: string | null
        }
        Update: {
          cancellation_date?: string | null
          cancellation_reason?: string | null
          check_in?: string
          check_out?: string
          created_at?: string | null
          guest_id?: string
          host_id?: string
          id?: string
          monthly_rent?: number
          property_id?: string
          service_fee?: number
          special_requests?: string | null
          status?: string
          total_amount?: number
          total_months?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_with_ratings"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          action_taken: string | null
          content_id: string
          content_type: string
          created_at: string | null
          details: string | null
          id: string
          reason: string
          reporter_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          action_taken?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          details?: string | null
          id?: string
          reason: string
          reporter_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          action_taken?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_with_ratings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          id: string
          payment_method: string
          payment_provider_response: Json | null
          phone_number: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          id?: string
          payment_method: string
          payment_provider_response?: Json | null
          phone_number?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          id?: string
          payment_method?: string
          payment_provider_response?: Json | null
          phone_number?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          created_at: string | null
          data_type: string
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          data_type: string
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          data_type?: string
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      properties: {
        Row: {
          amenities: string[] | null
          approved_at: string | null
          approved_by: string | null
          available_from: string | null
          average_rating: number | null
          bathrooms: number
          bedrooms: number
          contact_phone: string | null
          contact_whatsapp_phone: string | null
          created_at: string | null
          description: string
          host_id: string
          id: string
          images: string[]
          is_available: boolean | null
          location: string
          min_rental_months: number | null
          nearby_services: string[] | null
          price: number
          price_period: string | null
          property_type: string
          rejection_reason: string | null
          reviewed_at: string | null
          square_meters: number | null
          status: string | null
          title: string
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          available_from?: string | null
          average_rating?: number | null
          bathrooms: number
          bedrooms: number
          contact_phone?: string | null
          contact_whatsapp_phone?: string | null
          created_at?: string | null
          description: string
          host_id: string
          id?: string
          images?: string[]
          is_available?: boolean | null
          location: string
          min_rental_months?: number | null
          nearby_services?: string[] | null
          price: number
          price_period?: string | null
          property_type: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          square_meters?: number | null
          status?: string | null
          title: string
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          available_from?: string | null
          average_rating?: number | null
          bathrooms?: number
          bedrooms?: number
          contact_phone?: string | null
          contact_whatsapp_phone?: string | null
          created_at?: string | null
          description?: string
          host_id?: string
          id?: string
          images?: string[]
          is_available?: boolean | null
          location?: string
          min_rental_months?: number | null
          nearby_services?: string[] | null
          price?: number
          price_period?: string | null
          property_type?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          square_meters?: number | null
          status?: string | null
          title?: string
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_addresses: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          district: string | null
          location: string | null
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
          location?: string | null
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
          location?: string | null
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
          },
          {
            foreignKeyName: "property_addresses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties_with_ratings"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          accuracy: number | null
          booking_id: string
          cleanliness: number | null
          comment: string
          communication: number | null
          created_at: string | null
          id: string
          images: string[] | null
          location_rating: number | null
          property_id: string
          rating: number
          updated_at: string | null
          user_id: string
          value: number | null
        }
        Insert: {
          accuracy?: number | null
          booking_id: string
          cleanliness?: number | null
          comment: string
          communication?: number | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          location_rating?: number | null
          property_id: string
          rating: number
          updated_at?: string | null
          user_id: string
          value?: number | null
        }
        Update: {
          accuracy?: number | null
          booking_id?: string
          cleanliness?: number | null
          comment?: string
          communication?: number | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          location_rating?: number | null
          property_id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_with_ratings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      properties_with_ratings: {
        Row: {
          amenities: string[] | null
          available_from: string | null
          average_rating: number | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          description: string | null
          host_id: string | null
          id: string | null
          images: string[] | null
          location: string | null
          price: number | null
          property_type: string | null
          rejection_reason: string | null
          review_count: number | null
          square_meters: number | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_stats: {
        Row: {
          approved_properties: number | null
          average_price: number | null
          max_price: number | null
          min_price: number | null
          pending_properties: number | null
          rejected_properties: number | null
          total_properties: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_profile_completeness: {
        Args: { profile_id: string }
        Returns: number
      }
      get_booking_trends: {
        Args: { end_date: string; group_by: string; start_date: string }
        Returns: {
          booking_count: number
          period: string
          total_revenue: number
        }[]
      }
      get_user_growth: {
        Args: { end_date: string; group_by: string; start_date: string }
        Returns: {
          period: string
          user_count: number
        }[]
      }
      get_user_with_auth_data: {
        Args: { user_id_param: string }
        Returns: {
          avatar_url: string
          created_at: string
          email: string
          id: string
          is_host: boolean
          is_suspended: boolean
          name: string
          phone: string
          role: string
          suspension_reason: string
          user_id: string
        }[]
      }
      get_users_with_auth_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          created_at: string
          email: string
          id: string
          is_host: boolean
          is_suspended: boolean
          name: string
          phone: string
          role: string
          suspension_reason: string
          user_id: string
        }[]
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
