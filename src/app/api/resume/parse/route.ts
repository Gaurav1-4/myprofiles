import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseResumeWithGemini } from '@/lib/ai/gemini'
import { portfolioDataSchema } from '@/lib/validations/portfolio.schema'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = process.env.UPSTASH_REDIS_REST_URL 
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 d'), // 10 parses per day per user
    })
  : null

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Rate Limiting by User ID
    if (ratelimit) {
      const { success } = await ratelimit.limit(user.id)
      if (!success) {
        return NextResponse.json({ error: 'Daily parse limit reached. Try again tomorrow.' }, { status: 429 })
      }
    }

    const { text, pdfBase64 } = await req.json()
    
    console.log('[Resume API] Received request - text length:', text?.length || 0, 'pdfBase64 length:', pdfBase64?.length || 0)
    
    if ((!text || text.trim().length < 30) && !pdfBase64) {
      // Very short text and no PDF — return default schema with user's name
      return NextResponse.json(portfolioDataSchema.parse({ full_name: user.user_metadata?.full_name || '' }))
    }

    let result
    try {
      result = await parseResumeWithGemini(text, pdfBase64)
    } catch (geminiError: any) {
      console.error('[Resume API] Gemini parsing failed:', geminiError.message)
      // Return default structure if AI fails — don't block the flow
      return NextResponse.json(safeParseResult({}, user.user_metadata?.full_name))
    }

    // 2. Build the validated result, preserving all extracted data
    const validatedResult = safeParseResult(result, user.user_metadata?.full_name)
    
    console.log('[Resume API] Final result - skills:', validatedResult.skills?.length, 
                'projects:', validatedResult.projects?.length,
                'experience:', validatedResult.experience?.length)
    
    return NextResponse.json(validatedResult)

  } catch (error: any) {
    console.error('[Resume API] Error:', error.message)
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 })
  }
}

function safeParseResult(data: any, defaultName?: string) {
  try {
    // Attempt full validation
    return portfolioDataSchema.parse(data)
  } catch (error) {
    // Partial extraction — keep as much data as possible even if some fields
    // don't pass strict validation
    const base: any = {
      full_name: data?.full_name || defaultName || '',
      tagline: data?.tagline || '',
      bio: data?.bio || '',
      location: data?.location || '',
      education: sanitizeArray(data?.education, ['institution', 'degree']),
      experience: sanitizeArray(data?.experience, ['company', 'position']),
      projects: sanitizeArray(data?.projects, ['title']),
      skills: sanitizeArray(data?.skills, ['name']),
      achievements: sanitizeArray(data?.achievements, ['title']),
      template_id: 'minimal',
      theme: { primaryColor: '#8b5cf6', fontFamily: 'Inter' },
    }

    // Preserve links if they exist
    if (data?.links && typeof data.links === 'object') {
      base.links = {
        github: data.links.github || '',
        linkedin: data.links.linkedin || '',
        twitter: data.links.twitter || '',
        portfolio: data.links.portfolio || '',
        email: data.links.email || '',
      }
    }

    return base
  }
}

// Sanitize arrays — keep items that have the required fields, drop broken ones
function sanitizeArray(arr: any, requiredFields: string[]): any[] {
  if (!Array.isArray(arr)) return []
  return arr.filter((item: any) => {
    if (!item || typeof item !== 'object') return false
    return requiredFields.every(field => item[field] && String(item[field]).trim().length > 0)
  })
}
