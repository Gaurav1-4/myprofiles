'use client'

import { useEffect } from 'react'

export function PortfolioViewTracker({ username }: { username: string }) {
  useEffect(() => {
    // Fire-and-forget analytics beacon
    const data = {
      username,
      referrer: document.referrer || 'direct',
      timestamp: new Date().toISOString()
    }
    
    // Using sendBeacon for non-blocking analytics
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/beacon', blob)
    } else {
      fetch('/api/analytics/beacon', {
        method: 'POST',
        body: JSON.stringify(data),
        keepalive: true
      }).catch(() => {}) // Silently ignore failures
    }
  }, [username])

  return null
}
