'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, User, Mail, Lock, LogOut, Trash2, Loader2, 
  Shield, Bell, Palette, ChevronRight, ExternalLink, Layers
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setProfile(profile)
        setFullName(profile.full_name || '')
      }
      setLoading(false)
    }
    loadData()
  }, [])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Settings saved!')
    } catch (e: any) {
      toast.error(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link 
            href="/dashboard"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Settings</h1>
            <p className="text-sm text-zinc-500 font-medium">Manage your account and preferences.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <SettingsCard title="Profile" icon={<User className="w-5 h-5" />}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-700"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</label>
                <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-white/[0.02] border border-white/5 text-zinc-500 text-sm">
                  <Mail className="w-4 h-4 text-zinc-600" />
                  {user?.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Username</label>
                <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-white/[0.02] border border-white/5 text-zinc-500 text-sm">
                  <span className="text-zinc-600">myprofiles.co.in/</span>
                  <span className="text-white font-bold">{profile?.username || '—'}</span>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-11 px-8 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                Save Changes
              </button>
            </div>
          </SettingsCard>

          {/* Quick Links */}
          <SettingsCard title="Quick Actions" icon={<Palette className="w-5 h-5" />}>
            <div className="space-y-2">
              <SettingsLink href="/onboarding" label="Edit Portfolio" description="Update your profile content" />
              <SettingsLink href="/onboarding?step=4" label="Change Template" description="Switch your portfolio design" />
              {profile?.username && (
                <SettingsLink href={`/${profile.username}`} label="View Live Site" description="See your public portfolio" external />
              )}
            </div>
          </SettingsCard>

          {/* Account Section */}
          <SettingsCard title="Account" icon={<Shield className="w-5 h-5" />}>
            <div className="space-y-3">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                  <span className="text-sm font-bold text-zinc-400 group-hover:text-white">Sign Out</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-700" />
              </button>
            </div>
          </SettingsCard>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-xs text-zinc-700">MyProfiles v1.0 · Built with ❤️ in India</p>
        </div>
      </div>
    </div>
  )
}

function SettingsCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
          {icon}
        </div>
        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function SettingsLink({ href, label, description, external }: { href: string; label: string; description: string; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/5 transition-all group"
    >
      <div>
        <p className="text-sm font-bold text-zinc-300 group-hover:text-white">{label}</p>
        <p className="text-xs text-zinc-600">{description}</p>
      </div>
      {external ? (
        <ExternalLink className="w-4 h-4 text-zinc-700 group-hover:text-white" />
      ) : (
        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-transform" />
      )}
    </Link>
  )
}
