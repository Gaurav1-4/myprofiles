import Link from 'next/link'
import { Layers } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full" />
        
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
            <Layers className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-black tracking-tight">MyProfiles</span>
        </Link>
        
        <div className="relative z-10">
          <blockquote className="space-y-4">
            <p className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              &ldquo;MyProfiles helped me land my dream internship at Google. The AI resume parsing was magic.&rdquo;
            </p>
            <footer className="text-lg text-white/60 font-medium">— Rahul Sharma, IIT Delhi</footer>
          </blockquote>
        </div>

        <div className="relative z-10 text-sm text-white/40 font-medium">
          © {new Date().getFullYear()} MyProfiles. All rights reserved.
        </div>
      </div>
      
      {/* Right panel — form */}
      <div className="flex items-center justify-center p-8 bg-zinc-950">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
