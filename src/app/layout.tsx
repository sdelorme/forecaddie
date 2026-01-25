import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'
import { Header, Footer } from '@/components/shared'
import { ScrollWrapper, LiveStatsProvider, PlayerFlagsProvider } from '@/components/providers'
import { getLiveLeaderboard, getSchedule } from '@/lib/api/datagolf'
import { getCurrentEvent } from '@/lib/utils'

const lora = Lora({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Forecaddie - Golf Statistics & Tournament Tracking',
    template: '%s | Forecaddie'
  },
  description: 'Live PGA Tour leaderboards, player rankings, and betting odds powered by DataGolf.',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [initialData, schedule] = await Promise.all([getLiveLeaderboard(), getSchedule()])

  const now = new Date()
  const currentEvent = getCurrentEvent(schedule, now)
  const isComplete = currentEvent?.status === 'completed'

  return (
    <html lang="en" className="h-full">
      <body className={`${lora.className} bg-black min-h-full flex flex-col`}>
        <PlayerFlagsProvider>
          <ScrollWrapper>
            <LiveStatsProvider initialData={initialData} isComplete={isComplete}>
              <Header />
            </LiveStatsProvider>
          </ScrollWrapper>
          <div className="pt-[144px]">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </PlayerFlagsProvider>
      </body>
    </html>
  )
}
