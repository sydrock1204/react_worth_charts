import { Database } from '../utils/supabase-schema'

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient<Database>(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  import.meta.env.VITE_PUBLIC_SUPABASE_URL_ANON_KEY
)
