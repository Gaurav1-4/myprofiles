import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { portfolioDataSchema } from '@/lib/validations/portfolio.schema'

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    
    // Validate data against schema before saving
    const validatedData = portfolioDataSchema.partial().parse(body)

    const { error } = await supabase
      .from('portfolio_data')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('profile_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Draft save error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
