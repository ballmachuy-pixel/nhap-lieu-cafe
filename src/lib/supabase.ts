import { createClient } from '@supabase/supabase-js';

// Đảm bảo code này chỉ chạy trên server (ví dụ: Server Actions, API Routes)
if (typeof window !== 'undefined') {
  throw new Error('Supabase client should only be instantiated on the server.');
}

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database using the Service Role Key
// Điều này cho phép bypass RLS đối với việc INSERT.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
