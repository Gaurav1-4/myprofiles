import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { RESERVED_USERNAMES } from '@/lib/constants/reserved-usernames'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize rate limiter if Upstash is configured
const ratelimit = process.env.UPSTASH_REDIS_REST_URL 
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(30, '1 m'),
    })
  : null

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username')?.toLowerCase()

    if (!username) {
      return NextResponse.json({ available: false, reason: 'invalid' }, { status: 400 })
    }

    // Rate limiting
    if (ratelimit) {
      const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
      const { success } = await ratelimit.limit(ip)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
    }

    // Stage 1: Format Validation
    const usernameRegex = /^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/
    if (username.length < 3 || username.length > 30 || !usernameRegex.test(username)) {
      return NextResponse.json({ 
        available: false, 
        reason: 'invalid',
        message: 'Username must be 3-30 characters and can only contain letters, numbers, hyphens, and underscores.' 
      })
    }

    // Stage 2: Reserved Check
    if (RESERVED_USERNAMES.includes(username)) {
      return NextResponse.json({ 
        available: false, 
        reason: 'reserved',
        suggestions: generateSuggestions(username)
      })
    }

    // Stage 3: DB Check
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle()

    if (error) throw error

    if (data) {
      return NextResponse.json({ 
        available: false, 
        reason: 'taken',
        suggestions: await generateAvailableSuggestions(username)
      })
    }

    return NextResponse.json({ available: true })

  } catch (error: any) {
    console.error('Username check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateSuggestions(base: string): string[] {
  return [
    `${base}1`,
    `${base}2`,
    `${base}_dev`,
  ]
}

async function generateAvailableSuggestions(base: string): Promise<string[]> {
  const suggestions = generateSuggestions(base)
  const supabase = await createClient()
  
  const { data: taken } = await supabase
    .from('profiles')
    .select('username')
    .in('username', suggestions)

  const takenNames = taken?.map(t => t.username) || []
  return suggestions.filter(s => !takenNames.includes(s) && !RESERVED_USERNAMES.includes(s))
}
