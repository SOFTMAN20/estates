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
          property_type: string
          rejection_reason: string | null
          reviewed_at: string | null
          square_meters: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
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
      }
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Row"]
