import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) return new Response('Username is required', { status: 400 })

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, portfolio_data(tagline)')
    .eq('username', username)
    .single()

  if (!profile) return new Response('Profile not found', { status: 404 })

  const data = profile.portfolio_data as any

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1e1e1e 0%, #000 100%)',
          color: '#fff',
          padding: '40px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              style={{ width: '150px', height: '150px', borderRadius: '75px', marginBottom: '30px', border: '4px solid #8b5cf6' }}
            />
          )}
          <h1 style={{ fontSize: '72px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>
            {profile.full_name}
          </h1>
          <p style={{ fontSize: '32px', color: '#a1a1aa', marginTop: '10px', textAlign: 'center' }}>
            {data?.tagline || 'My Professional Portfolio'}
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: '40px', right: '40px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>MyProfiles.co.in</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
