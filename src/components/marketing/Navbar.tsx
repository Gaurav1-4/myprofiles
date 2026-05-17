'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <Layers className="w-5 h-5 text-black" />
          </div>
          <span className="text-lg font-black tracking-tight">MyProfiles</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-zinc-500 hover:text-white transition-colors font-medium">
            Features
          </Link>
          <Link href="#how" className="text-sm text-zinc-500 hover:text-white transition-colors font-medium">
            How it Works
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium px-4 py-2">
            Log in
          </Link>
          <Link 
            href="/signup"
            className="text-xs font-bold uppercase tracking-wider px-6 py-2.5 bg-white text-black rounded-full hover:bg-zinc-200 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
