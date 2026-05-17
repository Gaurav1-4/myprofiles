'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PortfolioData } from '@/lib/validations/portfolio.schema'
import { UsernameStep } from '@/components/dashboard/onboarding/UsernameStep'
import { ResumeStep } from '@/components/dashboard/onboarding/ResumeStep'
import { ProfileEditor } from '@/components/portfolio/editor/ProfileEditor'
import { TemplateStep } from '@/components/dashboard/onboarding/TemplateStep'
import { PublishStep } from '@/components/dashboard/onboarding/PublishStep'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'
import { OnboardingFlow } from '@/components/dashboard/onboarding/OnboardingFlow'

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Central State
  const [username, setUsername] = useState('')
  const [portfolioData, setPortfolioData] = useState<Partial<PortfolioData>>({})
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // 1. Check for existing draft and profile status, and read ?step= param
  useEffect(() => {
    async function initOnboarding() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, published')
        .eq('id', user.id)
        .single()

      // Load draft if exists
      const { data: draft } = await supabase
        .from('portfolio_data')
        .select('*')
        .eq('profile_id', user.id)
        .single()

      if (draft) {
        setPortfolioData(draft)
      }

      if (profile?.username) {
        setUsername(profile.username)
      }

      // If coming from dashboard with ?step= query param and user has data,
      // jump to the requested step (for "Edit Profile" / "Switch Template" links)
      const stepParam = searchParams.get('step')
      if (stepParam && profile?.username) {
        const requestedStep = parseInt(stepParam, 10) - 1 // Convert 1-indexed to 0-indexed
        if (requestedStep >= 0 && requestedStep <= 4) {
          setCurrentStep(requestedStep)
        }
      } else if (profile?.published) {
        // If already published and no specific step requested, go to editor (step 2)
        setCurrentStep(2)
      }

      setLoading(false)
    }
    initOnboarding()
  }, [])

  // 2. Auto-save Draft (Debounced)
  const debouncedData = useDebounce(portfolioData, 2000)
  useEffect(() => {
    if (Object.keys(debouncedData).length > 0 && currentStep >= 2) {
      saveDraft(debouncedData)
    }
  }, [debouncedData, currentStep])

  async function saveDraft(data: Partial<PortfolioData>) {
    setIsSaving(true)
    try {
      await fetch('/api/profile/draft', {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Draft save failed')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
    </div>
  )

  const steps = [
    <UsernameStep 
      key="step-0" 
      initialValue={username} 
      onNext={(val) => { setUsername(val); setCurrentStep(1) }} 
    />,
    <ResumeStep 
      key="step-1" 
      onNext={(data) => {
        setPortfolioData(data)
        setCurrentStep(2)
      }} 
      onSkip={() => setCurrentStep(2)} 
    />,
    <ProfileEditor 
      key="step-2" 
      data={portfolioData as PortfolioData} 
      onChange={setPortfolioData} 
      onNext={() => {
        saveDraft(portfolioData)
        setCurrentStep(3)
      }} 
      onBack={() => setCurrentStep(1)}
      isSaving={isSaving}
    />,
    <TemplateStep 
      key="step-3" 
      onNext={(templateId, newAvatarUrl) => {
        setPortfolioData(prev => ({ ...prev, template_id: templateId }))
        if (newAvatarUrl) setAvatarUrl(newAvatarUrl)
        setCurrentStep(4)
      }} 
      onBack={() => setCurrentStep(2)}
    />,
    <PublishStep 
      key="step-4" 
      username={username}
      data={{ ...portfolioData, template_id: (portfolioData as any).template_id || 'minimal', avatar_url: avatarUrl } as any}
      onBack={() => setCurrentStep(3)}
    />
  ]

  return (
    <OnboardingFlow currentStep={currentStep + 1}>
      {steps[currentStep]}
      <div className="fixed bottom-6 right-6 text-[10px] uppercase tracking-widest text-zinc-700 font-medium">
        {isSaving ? 'Saving draft...' : 'All changes saved'}
      </div>
    </OnboardingFlow>
  )
}
