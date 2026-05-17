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

    // 1. Validate File Type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG and WebP images are allowed' }, { status: 400 })
    }

    // 2. Validate File Size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 2MB limit' }, { status: 400 })
    }

    // 3. Extract Extension
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `avatar.${ext}`

    // 4. Upload to Supabase Storage (Public avatars bucket)
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`${user.id}/${fileName}`, file, {
        upsert: true,
        contentType: file.type,
      })

    if (error) throw error

    // 5. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl })

  } catch (error: any) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
