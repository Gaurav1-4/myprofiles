import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  // Fetch Analytics Stats from analytics_events table
  const stats = {
    views7d: 0,
    views30d: 0,
    trend7d: '+0%',
    trend30d: '+0%'
  }

  if (profile.username) {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const [{ count: views7d }, { count: views30d }] = await Promise.all([
      supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('username', profile.username)
        .eq('event_type', 'view')
        .gte('created_at', sevenDaysAgo),
      supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('username', profile.username)
        .eq('event_type', 'view')
        .gte('created_at', thirtyDaysAgo),
    ])

    if (views7d !== null) stats.views7d = views7d
    if (views30d !== null) stats.views30d = views30d
  }

  return <DashboardClient profile={profile} stats={stats} />
}
