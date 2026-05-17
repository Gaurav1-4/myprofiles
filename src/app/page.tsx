import { Navbar } from '@/components/marketing/Navbar'
import { Hero } from '@/components/marketing/Hero'
import Link from 'next/link'
import { Layers } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navbar />
      <Hero />
      
      {/* Features Section */}
      <section id="features" className="py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400 mb-4 block">Why MyProfiles</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              Everything you need to <br />
              <span className="premium-text-gradient">stand out.</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto font-medium">
              Built specifically for Indian college students and freshers navigating placements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="AI Resume Parsing"
              description="Upload your PDF resume and let our Gemini-powered AI extract every detail perfectly."
              icon="⚡"
            />
            <FeatureCard 
              title="Premium Templates"
              description="Choose from Minimal, Developer, or Creative templates designed to impress recruiters."
              icon="🎨"
            />
            <FeatureCard 
              title="Instant Hosting"
              description="Get a professional URL like myprofiles.co.in/yourname instantly. No hosting setup required."
              icon="🌐"
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.3em] mb-10">Trusted by students from</p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-6 text-zinc-700">
            <span className="text-xl font-black tracking-tight">IIT Delhi</span>
            <span className="text-xl font-black tracking-tight">BITS Pilani</span>
            <span className="text-xl font-black tracking-tight">VIT Vellore</span>
            <span className="text-xl font-black tracking-tight">SRM University</span>
            <span className="text-xl font-black tracking-tight">DTU</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <Layers className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-bold">MyProfiles</span>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} MyProfiles. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs text-zinc-500 hover:text-white transition-colors font-medium">Login</Link>
            <Link href="/signup" className="text-xs text-zinc-500 hover:text-white transition-colors font-medium">Sign Up</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 transition-all duration-500">
      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3 text-white">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  )
}
