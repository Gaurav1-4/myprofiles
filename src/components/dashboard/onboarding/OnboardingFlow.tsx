'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, User, FileText, Layout, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  icon: React.ReactNode
}

const steps: Step[] = [
  { id: 1, title: 'Username', icon: <User className="w-4 h-4" /> },
  { id: 2, title: 'Resume', icon: <FileText className="w-4 h-4" /> },
  { id: 3, title: 'Profile', icon: <FileText className="w-4 h-4" /> },
  { id: 4, title: 'Template', icon: <Layout className="w-4 h-4" /> },
  { id: 5, title: 'Publish', icon: <CheckCircle className="w-4 h-4" /> },
]

export function OnboardingFlow({ 
  currentStep, 
  children 
}: { 
  currentStep: number
  children: React.ReactNode 
}) {
  // We want the Profile Editor (Step 3) to have more space
  const isWideStep = currentStep === 3

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Progress Indicator */}
      <div className="max-w-5xl mx-auto pt-16 pb-12 px-6 relative z-10">
        <div className="relative flex justify-between items-center max-w-3xl mx-auto">
          {/* Progress Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-zinc-800 z-0" />
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-purple-500 to-blue-500 z-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id
            const isActive = currentStep === step.id
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isActive ? '#a855f7' : '#18181b',
                    scale: isActive ? 1.15 : 1,
                    boxShadow: isActive ? '0 0 20px rgba(168,85,247,0.4)' : 'none'
                  }}
                  className={cn(
                    "w-11 h-11 rounded-full border border-white/5 flex items-center justify-center transition-all duration-500",
                    isActive && "border-purple-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={cn(
                      "text-sm font-medium",
                      isActive ? "text-white" : "text-zinc-500"
                    )}>
                      {step.id}
                    </span>
                  )}
                </motion.div>
                <span className={cn(
                  "absolute -bottom-8 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block transition-colors duration-500",
                  isActive ? "text-white" : "text-zinc-600"
                )}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <main className={cn(
        "mx-auto px-6 py-12 relative z-10 transition-all duration-700 ease-in-out",
        isWideStep ? "max-w-7xl" : "max-w-2xl"
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <div className="py-8 flex items-center justify-center gap-2 opacity-20">
        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
          <span className="text-black font-black text-xs">M</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">MyProfiles</span>
      </div>
    </div>
  )
}
