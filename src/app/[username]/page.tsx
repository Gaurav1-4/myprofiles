import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTemplateComponent } from '@/components/portfolio/templates'
import { PortfolioViewTracker } from '@/components/portfolio/PortfolioViewTracker'

export const revalidate = 86400 // 24 hour fallback, primary revalidation is on-demand

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, tagline, bio, username')
    .eq('username', username.toLowerCase())
    .eq('published', true)
    .single()

  if (!profile) return { title: 'Not Found | MyProfiles' }

  return {
    title: `${profile.full_name} | MyProfiles`,
    description: profile.tagline || profile.bio || `Professional portfolio of ${profile.full_name}`,
    openGraph: {
      title: profile.full_name,
      description: profile.tagline || profile.bio,
      images: [`/api/og?username=${profile.username}`],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: profile.full_name,
      description: profile.tagline,
      images: [`/api/og?username=${profile.username}`],
    },
    robots: 'index, follow',
  }
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()
  
  // Join profile with portfolio data
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      portfolio_data (*)
    `)
    .eq('username', username.toLowerCase())
    .eq('published', true)
    .single()

  if (error || !profile) {
    return notFound()
  }

  const portfolioData = profile.portfolio_data
  const Template = getTemplateComponent(profile.template_id)

  return (
    <main className="min-h-screen bg-black text-white">
      <Template 
        profile={profile} 
        data={portfolioData} 
        showBadge={true} 
      />
      <PortfolioViewTracker username={username} />
    </main>
  )
}
