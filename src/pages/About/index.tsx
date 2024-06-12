import { useState, useEffect, FC } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://anzokzgypqsevpzbuxrm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuem9remd5cHFzZXZwemJ1eHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI1NzM2NjEsImV4cCI6MjAyODE0OTY2MX0.x4KppatP1Aj2DgQ0iltiUIQdrBTuMjTTPVS4w6-RDZE'
)

// const About: FC = () => {
//   return <h1 className="font-mono">This is about!</h1>
// }

const About = () => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    getCountries()
  }, [])

  async function getCountries() {
    const { data } = await supabase.from('countries').select()
    setCountries(data)
  }

  return (
    <ul>
      {countries.map(country => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  )
}

export default About
