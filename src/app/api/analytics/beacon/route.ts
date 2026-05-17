import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    let body: any
    
    // Handle both JSON and sendBeacon (which sends as blob)
    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/json') || contentType.includes('text/plain')) {
      body = await req.json()
    } else {
      const text = await req.text()
      body = JSON.parse(text)
    }

    const { username, referrer } = body

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
    }

    // Sanitize inputs
    const cleanUsername = username.toLowerCase().slice(0, 30)
    const cleanReferrer = (referrer || 'direct').slice(0, 500)

    // Insert analytics event using service role to bypass RLS
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        username: cleanUsername,
        event_type: 'view',
        referrer: cleanReferrer,
      })

    if (error) {
      console.error('[Analytics] Insert error:', error.message)
      // Don't expose internal errors — analytics should fail silently
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Analytics should never break the user experience
    return NextResponse.json({ ok: true })
  }
}
