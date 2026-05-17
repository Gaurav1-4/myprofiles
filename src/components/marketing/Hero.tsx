'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Upload, Cpu, Rocket } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-purple-400 mb-8 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            AI-Powered Portfolio Builder
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] mb-8">
            Your Professional
            <br />
            Identity, <span className="premium-text-gradient">Sorted.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Upload your resume. AI structures your data. Pick a template. 
            Launch your portfolio at <span className="text-white font-bold">myprofiles.co.in/you</span> — free.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup"
              className="group flex items-center gap-3 h-14 px-10 text-sm font-bold uppercase tracking-wider bg-white text-black rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              Create My Portfolio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#how"
              className="flex items-center gap-2 h-14 px-10 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
            >
              See how it works
            </Link>
          </div>
        </motion.div>

        {/* How It Works — 3 Step Cards */}
        <motion.div
          id="how"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <StepCard 
            step="01" 
            icon={<Upload className="w-6 h-6" />}
            title="Upload Resume" 
            description="Drop your PDF. Gemini AI extracts every detail — name, experience, skills, projects." 
          />
          <StepCard 
            step="02" 
            icon={<Cpu className="w-6 h-6" />}
            title="Edit & Style" 
            description="Fine-tune your data in a live editor with real-time preview. Pick your template." 
          />
          <StepCard 
            step="03" 
            icon={<Rocket className="w-6 h-6" />}
            title="Go Live" 
            description="Publish to myprofiles.co.in/you in one click. Share it anywhere, anytime." 
          />
        </motion.div>
      </div>
    </section>
  )
}

function StepCard({ step, icon, title, description }: { step: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 transition-all duration-500 text-left">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <span className="text-5xl font-black text-white/[0.04] leading-none">{step}</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  )
}
