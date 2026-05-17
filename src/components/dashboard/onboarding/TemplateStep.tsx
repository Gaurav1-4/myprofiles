'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Upload, ChevronLeft, ChevronRight, Palette, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TemplateStepProps {
  onNext: (templateId: string, avatarUrl?: string) => void
  onBack: () => void
}

const templates = [
  { id: 'minimal', name: 'Minimal', description: 'Clean & Professional', color: 'bg-white text-black' },
  { id: 'developer', name: 'Developer', description: 'Terminal Aesthetic', color: 'bg-zinc-900 text-emerald-500' },
  { id: 'creative', name: 'Creative', description: 'Bold & Energetic', color: 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' },
]

export function TemplateStep({ onNext, onBack }: TemplateStepProps) {
  const [selected, setSelected] = useState('minimal')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP images are allowed')
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }

    // Show local preview immediately
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload to Supabase Storage
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const { url } = await response.json()
      setAvatarUrl(url)
      toast.success('Photo uploaded!')
    } catch (error: any) {
      console.error('Avatar upload error:', error)
      toast.error(error.message || 'Failed to upload photo')
      setAvatarPreview(null) // Clear preview on failure
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
          <Palette className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">Define your Vibe</h2>
        <p className="text-zinc-500 text-sm font-medium tracking-wide">
          Select a visual language and add your <span className="text-white">Profile Identity</span>.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <div className="w-40 h-40 rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden relative transition-all duration-500 group-hover:border-purple-500/50 group-hover:scale-[1.02] shadow-2xl">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <Upload className="h-8 w-8 text-zinc-700 group-hover:text-purple-500 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Add Photo</span>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-[2.5rem]">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            )}
          </div>
          <input 
            type="file" 
            id="avatar" 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp" 
            onChange={handleFileChange} 
          />
          <button 
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white text-black h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
            onClick={() => document.getElementById('avatar')?.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : avatarPreview ? 'Change Photo' : 'Select Photo'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {templates.map((t) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={cn(
              "relative group p-2 rounded-[2rem] cursor-pointer transition-all duration-500 border border-transparent",
              selected === t.id ? "bg-white/5 border-white/10 shadow-2xl" : "hover:bg-white/[0.02]"
            )}
          >
            <div className={cn(
              "aspect-[4/5] rounded-[1.5rem] flex items-center justify-center overflow-hidden border border-white/5 shadow-inner transition-all duration-500",
              t.color,
              selected === t.id && "scale-[0.98]"
            )}>
               <span className="font-black text-xs uppercase tracking-[0.2em]">{t.name}</span>
            </div>
            <div className="mt-6 px-4 pb-4">
              <h3 className={cn(
                "font-black text-xs uppercase tracking-widest transition-colors duration-500",
                selected === t.id ? "text-white" : "text-zinc-500"
              )}>{t.name}</h3>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{t.description}</p>
            </div>
            {selected === t.id && (
              <motion.div 
                layoutId="check"
                className="absolute top-6 right-6 bg-white rounded-full p-1.5 shadow-xl"
              >
                <Check className="h-4 w-4 text-black" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-12 border-t border-white/5">
        <Button variant="ghost" onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white">
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous Step
        </Button>
        <Button 
          onClick={() => onNext(selected, avatarUrl || undefined)} 
          disabled={isUploading}
          className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl disabled:opacity-50"
        >
          Preview & Launch <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
