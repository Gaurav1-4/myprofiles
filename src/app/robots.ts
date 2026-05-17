import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://myprofiles.in'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing'],
        disallow: [
          '/dashboard/',
          '/onboarding/',
          '/api/',
          '/settings/',
          '/login',
          '/signup'
        ],
      },
      {
        userAgent: '*',
        allow: '/*', // Allow all dynamic portfolio routes
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
