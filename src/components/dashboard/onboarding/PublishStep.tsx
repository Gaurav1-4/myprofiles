'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy, ExternalLink, Rocket, Loader2, ChevronLeft, PartyPopper } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'

interface PublishStepProps {
  username: string
  data: any
  onBack: () => void
}

export function PublishStep({ username, data, onBack }: PublishStepProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const supabase = createClient()

  async function handlePublish() {
    setIsPublishing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // 1. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username,
          template_id: data.template_id || 'minimal',
          published: true,
          full_name: data.full_name,
          avatar_url: data.avatar_url
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // 2. Update Portfolio Data
      const { error: dataError } = await supabase
        .from('portfolio_data')
        .update({
          tagline: data.tagline,
          bio: data.bio,
          location: data.location,
          education: data.education,
          experience: data.experience,
          projects: data.projects,
          skills: data.skills,
          achievements: data.achievements,
          links: data.links,
          updated_at: new Date().toISOString()
        })
        .eq('profile_id', user.id)

      if (dataError) throw dataError

      setIsPublished(true)
      toast.success('Your portfolio is now live!')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to publish')
    } finally {
      setIsPublishing(false)
    }
  }

  const liveUrl = `myprofiles.co.in/${username}`

  if (isPublished) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-12 py-10">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-emerald-500/30"
        >
          <PartyPopper className="h-12 w-12 text-emerald-400" />
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-5xl font-black tracking-tight text-white uppercase italic">It&apos;s Alive!</h2>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">Your professional identity is now broadcasted to the world.</p>
        </div>
        
        <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Live URL</span>
            <span className="font-mono text-lg text-purple-400 break-all">{liveUrl}</span>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(liveUrl)
              toast.success('Link copied!')
            }}
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
          <Link href={`/${username}`} target="_blank" className="flex-1">
            <Button className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl">
              Visit Portfolio <ExternalLink className="ml-3 w-4 h-4" />
            </Button>
          </Link>
          
          <Link href="/dashboard" className="flex-1">
            <Button variant="ghost" className="w-full h-16 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-[0.3em]">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto text-center space-y-12 py-10">
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 bg-purple-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.2)]"
      >
        <Rocket className="h-12 w-12 text-purple-400" />
      </motion.div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">Ready to Launch?</h2>
        <p className="text-zinc-500 text-sm font-medium tracking-wide">Take a deep breath. Your new professional home is one click away.</p>
      </div>

      <div className="flex flex-col gap-6 pt-10">
        <Button 
          size="lg" 
          onClick={handlePublish}
          disabled={isPublishing}
          className="h-20 text-[10px] font-black uppercase tracking-[0.4em] bg-white text-black hover:bg-zinc-200 rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all active:scale-[0.98]"
        >
          {isPublishing ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : null}
          Initiate Launch
        </Button>
        <button 
          onClick={onBack} 
          disabled={isPublishing}
          className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
        >
          Wait, I need to fix one thing
        </button>
      </div>
    </div>
  )
}
