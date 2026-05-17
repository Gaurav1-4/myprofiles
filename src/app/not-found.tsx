import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <p className="text-8xl font-black tracking-tighter text-white/10">404</p>
          <h1 className="text-3xl font-black tracking-tight">Page Not Found</h1>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 h-12 px-8 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 h-12 px-8 text-zinc-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
