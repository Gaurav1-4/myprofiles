import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match only the paths that require authentication and session management.
     * Everything else, including public portfolio pages (/[username]),
     * the root landing page (/), and static assets completely bypasses middleware.
     */
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/profile/:path*',
    '/templates/:path*',
    '/api/profile/:path*',
    '/api/upload/:path*',
    '/api/resume/:path*',
  ],
}
