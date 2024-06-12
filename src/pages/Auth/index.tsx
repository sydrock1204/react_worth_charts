import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient(
  'https://anzokzgypqsevpzbuxrm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuem9remd5cHFzZXZwemJ1eHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI1NzM2NjEsImV4cCI6MjAyODE0OTY2MX0.x4KppatP1Aj2DgQ0iltiUIQdrBTuMjTTPVS4w6-RDZE'
)

export default function WorthAuth() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      return setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
  } else {
    return <div>Logged in!</div>
  }
}
