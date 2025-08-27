export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      trainers: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone?: string
          bio?: string
          avatar_url?: string
          business_name?: string
          business_address?: string
          business_website?: string
          business_instagram?: string
          work_hours?: string
          liqpay_public_key?: string
          liqpay_private_key?: string
          default_currency: string
          timezone: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string
          bio?: string
          avatar_url?: string
          business_name?: string
          business_address?: string
          business_website?: string
          business_instagram?: string
          work_hours?: string
          liqpay_public_key?: string
          liqpay_private_key?: string
          default_currency?: string
          timezone?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          bio?: string
          avatar_url?: string
          business_name?: string
          business_address?: string
          business_website?: string
          business_instagram?: string
          work_hours?: string
          liqpay_public_key?: string
          liqpay_private_key?: string
          default_currency?: string
          timezone?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          trainer_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string
          date_of_birth?: string
          gender?: 'male' | 'female' | 'other'
          emergency_contact?: string
          emergency_phone?: string
          medical_conditions?: string
          fitness_goals?: string
          experience_level: 'beginner' | 'intermediate' | 'advanced'
          status: 'active' | 'inactive' | 'archived'
          notes?: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string
          date_of_birth?: string
          gender?: 'male' | 'female' | 'other'
          emergency_contact?: string
          emergency_phone?: string
          medical_conditions?: string
          fitness_goals?: string
          experience_level?: 'beginner' | 'intermediate' | 'advanced'
          status?: 'active' | 'inactive' | 'archived'
          notes?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          date_of_birth?: string
          gender?: 'male' | 'female' | 'other'
          emergency_contact?: string
          emergency_phone?: string
          medical_conditions?: string
          fitness_goals?: string
          experience_level?: 'beginner' | 'intermediate' | 'advanced'
          status?: 'active' | 'inactive' | 'archived'
          notes?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      training_programs: {
        Row: {
          id: string
          trainer_id: string
          name: string
          description?: string
          category: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration_weeks: number
          exercises_count: number
          status: 'active' | 'draft' | 'archived'
          price?: number
          currency?: string
          cover_image_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          name: string
          description?: string
          category: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          duration_weeks: number
          exercises_count?: number
          status?: 'active' | 'draft' | 'archived'
          price?: number
          currency?: string
          cover_image_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          name?: string
          description?: string
          category?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          duration_weeks?: number
          exercises_count?: number
          status?: 'active' | 'draft' | 'archived'
          price?: number
          currency?: string
          cover_image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          trainer_id: string
          client_id: string
          program_id?: string
          title: string
          description?: string
          scheduled_at: string
          duration_minutes: number
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          location?: string
          notes?: string
          client_notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          client_id: string
          program_id?: string
          title: string
          description?: string
          scheduled_at: string
          duration_minutes?: number
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          location?: string
          notes?: string
          client_notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          client_id?: string
          program_id?: string
          title?: string
          description?: string
          scheduled_at?: string
          duration_minutes?: number
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          location?: string
          notes?: string
          client_notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          trainer_id: string
          client_id: string
          session_id?: string
          program_id?: string
          amount: number
          currency: string
          description: string
          status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          payment_method: 'liqpay' | 'cash' | 'bank_transfer' | 'other'
          liqpay_order_id?: string
          liqpay_transaction_id?: string
          due_date?: string
          paid_at?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          client_id: string
          session_id?: string
          program_id?: string
          amount: number
          currency?: string
          description: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          payment_method?: 'liqpay' | 'cash' | 'bank_transfer' | 'other'
          liqpay_order_id?: string
          liqpay_transaction_id?: string
          due_date?: string
          paid_at?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          client_id?: string
          session_id?: string
          program_id?: string
          amount?: number
          currency?: string
          description?: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          payment_method?: 'liqpay' | 'cash' | 'bank_transfer' | 'other'
          liqpay_order_id?: string
          liqpay_transaction_id?: string
          due_date?: string
          paid_at?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
