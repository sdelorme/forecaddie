import type { Metadata } from 'next'
import './globals.css'
import { Header, Footer } from '@/components/shared'
import { ScrollWrapper, LiveStatsProvider, PlayerFlagsProvider } from '@/components/providers'
import { TooltipProvider } from '@/components/ui'
import { getLiveLeaderboard, getSchedule } from '@/lib/api/datagolf'
import { getCurrentEvent } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Forecaddie - Golf Statistics & Tournament Tracking',
    template: '%s | Forecaddie'
  },
  description: 'Live PGA Tour leaderboards, player rankings, and betting odds powered by DataGolf.',
  icons: {
    icon: '/Icon.png'
  },
  openGraph: {
    title: 'Forecaddie - Golf Statistics & Tournament Tracking',
    description: 'Live PGA Tour leaderboards, player rankings, and betting odds powered by DataGolf.',
    siteName: 'Forecaddie',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Forecaddie - Golf Statistics & Tournament Tracking',
    description: 'Live PGA Tour leaderboards, player rankings, and betting odds powered by DataGolf.'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [initialData, schedule] = await Promise.all([
    getLiveLeaderboard().catch(() => undefined),
    getSchedule().catch(() => [])
  ])

  const now = new Date()
  const currentEvent = getCurrentEvent(schedule, now)
  const isComplete = currentEvent?.status === 'completed'

  return (
    <html lang="en" className="h-full">
      <body className="bg-black text-gray-300 min-h-full flex flex-col">
        <TooltipProvider delayDuration={200}>
          <PlayerFlagsProvider eventId={currentEvent?.eventId}>
            <LiveStatsProvider initialData={initialData} isComplete={isComplete}>
              <ScrollWrapper>
                <Header />
              </ScrollWrapper>
              <div className="pt-[144px]">
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </LiveStatsProvider>
          </PlayerFlagsProvider>
        </TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
