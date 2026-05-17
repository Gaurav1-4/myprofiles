import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { portfolioDataSchema } from '@/lib/validations/portfolio.schema'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { username, ...portfolioData } = body

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // 1. Final Data Validation & Save
    const validatedData = portfolioDataSchema.parse(portfolioData)

    // Atomic-like sequential operation
    // Update Portfolio Data
    const { error: dataError } = await supabase
      .from('portfolio_data')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('profile_id', user.id)

    if (dataError) throw dataError

    // 2. Update Profile & Set Published
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        username: username.toLowerCase(),
        published: true,
        full_name: validatedData.full_name,
        template_id: validatedData.template_id || 'minimal',
      })
      .eq('id', user.id)

    if (profileError) throw profileError

    // 3. Revalidate ISR Cache
    revalidatePath(`/${username}`)
    revalidatePath('/sitemap.xml')

    return NextResponse.json({ success: true, url: `/${username}` })

  } catch (error: any) {
    console.error('Publish error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
