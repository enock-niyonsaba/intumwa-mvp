import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type UserRole = 'user' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  category_id: string;
  department_id: string;
  description: string;
  status: 'Received' | 'Under Review' | 'Resolved';
  created_at: string;
  updated_at: string;
  last_status_updated_at: string;
}

export interface Feedback {
  id: string;
  complaint_id: string;
  rating: number;
  feedback_text: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  metadata: Record<string, any>;
  created_at: string;
} 