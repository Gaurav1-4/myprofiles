import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 1. Validate Content Type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // 2. Validate File Size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }

    // 3. Validate PDF Magic Bytes (%PDF)
    const buffer = await file.arrayBuffer()
    const header = new Uint8Array(buffer.slice(0, 4))
    const magic = String.fromCharCode(...Array.from(header))
    if (magic !== '%PDF') {
      return NextResponse.json({ error: 'Invalid PDF file structure' }, { status: 400 })
    }

    // 4. Upload to Supabase Storage (Private resumes bucket)
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(`${user.id}/resume.pdf`, file, {
        upsert: true,
        contentType: 'application/pdf',
      })

    if (error) throw error

    return NextResponse.json({ path: data.path })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
