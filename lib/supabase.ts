import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Server-side admin client (never expose to frontend)
export const supabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error('Missing service role key')
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type Database = {
  public: {
    Tables: {
      claims: {
        Row: {
          id: string
          claim_number: string
          insured_name: string
          policy_number: string
          insurance_company: string
          claim_type: string
          incident_date: string
          claim_amount: number
          surveyor_id: string | null
          status: 'pending' | 'under_survey' | 'report_submitted' | 'approved' | 'closed' | 'rejected'
          priority: 'normal' | 'high' | 'urgent'
          description: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: Omit<Database['public']['Tables']['claims']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['claims']['Insert']>
      }
      surveyors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          specialty: string
          status: 'available' | 'in_field' | 'office' | 'leave'
          rating: number
          created_at: string
        }
      }
      followups: {
        Row: {
          id: string
          claim_id: string
          contact_person: string
          contact_type: 'call' | 'email' | 'visit' | 'letter'
          due_date: string
          notes: string
          is_done: boolean
          created_at: string
          created_by: string
        }
      }
      documents: {
        Row: {
          id: string
          claim_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          uploaded_by: string
          created_at: string
        }
      }
      email_logs: {
        Row: {
          id: string
          claim_id: string | null
          party_name: string
          subject: string
          direction: 'sent' | 'received'
          notes: string | null
          created_at: string
          created_by: string
        }
      }
    }
  }
}
