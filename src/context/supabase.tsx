import { Database } from '../utils/supabase-schema'

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient<Database>(
  'https://anzokzgypqsevpzbuxrm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuem9remd5cHFzZXZwemJ1eHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI1NzM2NjEsImV4cCI6MjAyODE0OTY2MX0.x4KppatP1Aj2DgQ0iltiUIQdrBTuMjTTPVS4w6-RDZE'
)
