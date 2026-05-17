import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // Fetch all published profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .eq('published', true)

  const profileEntries: MetadataRoute.Sitemap = (profiles || []).map((profile) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${profile.username}`,
    lastModified: new Date(profile.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: process.env.NEXT_PUBLIC_BASE_URL!,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...profileEntries,
  ]
}
