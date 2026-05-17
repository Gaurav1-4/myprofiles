'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Check, X, AtSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'

interface UsernameStepProps {
  onNext: (username: string) => void
  initialValue: string
}

export function UsernameStep({ onNext, initialValue }: UsernameStepProps) {
  const [username, setUsername] = useState(initialValue)
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const debouncedUsername = useDebounce(username, 500)
  const supabase = createClient()

  useEffect(() => {
    async function checkUsername() {
      if (debouncedUsername.length < 3) {
        setIsAvailable(null)
        return
      }

      const reserved = ['admin', 'api', 'www', 'help', 'settings', 'dashboard', 'login', 'signup', 'pricing']
      if (reserved.includes(debouncedUsername.toLowerCase())) {
        setIsAvailable(false)
        setError('This username is reserved')
        return
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(debouncedUsername)) {
        setIsAvailable(false)
        setError('Use only letters, numbers, underscores, and hyphens')
        return
      }

      setIsChecking(true)
      const { data, error: pgError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', debouncedUsername)
        .maybeSingle()

      setIsChecking(false)
      if (pgError) {
        setError('Error checking availability')
        return
      }

      setIsAvailable(!data)
      setError(data ? 'Username is already taken' : null)
    }

    checkUsername()
  }, [debouncedUsername, supabase])

  return (
    <div className="max-w-md mx-auto space-y-12 py-10">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-500 mb-4">
          <AtSign className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-white uppercase">Claim your spot</h2>
        <p className="text-zinc-500 text-sm font-medium tracking-wide">
          Your portfolio will live at <span className="text-white">myprofiles.co.in/{username || 'username'}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative group">
          <input 
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            className={cn(
              "w-full h-20 text-3xl font-bold px-8 bg-white/[0.03] border border-white/5 rounded-[2rem] text-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-center placeholder:text-zinc-800",
              isAvailable === true && "border-emerald-500/50 focus:border-emerald-500",
              isAvailable === false && "border-rose-500/50 focus:border-rose-500"
            )}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            {isChecking && <Loader2 className="h-6 w-6 animate-spin text-purple-500" />}
            {!isChecking && isAvailable === true && (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
            )}
            {!isChecking && isAvailable === false && (
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
                <X className="h-4 w-4 text-rose-400" />
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-xs font-bold text-rose-500 text-center uppercase tracking-widest"
          >
            {error}
          </motion.p>
        )}
        
        <Button 
          onClick={() => onNext(username)}
          disabled={!isAvailable || isChecking}
          className="w-full h-16 text-xs font-black uppercase tracking-[0.3em] bg-white text-black hover:bg-zinc-200 rounded-[2rem] shadow-2xl shadow-purple-500/10 transition-all active:scale-[0.98]"
        >
          {isChecking ? 'Checking...' : 'Reserve my URL'}
        </Button>
      </div>
    </div>
  )
}
