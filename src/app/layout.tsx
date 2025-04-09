import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'
import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'
import { ScrollWrapper } from '@/components/providers/scroll-wrapper'
import { LiveStatsProvider } from '@/components/providers/live-stats-provider'
import { getLiveLeaderboard } from '@/lib/api/datagolf'

const lora = Lora({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CaddieBet',
  description: 'Make smarter golf bets',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialData = await getLiveLeaderboard()

  return (
    <html lang="en" className="h-full">
      <body className={`${lora.className} bg-black min-h-full flex flex-col`}>
        <ScrollWrapper>
          <LiveStatsProvider initialData={initialData}>
            <Header />
          </LiveStatsProvider>
        </ScrollWrapper>
        <div className="pt-[144px]">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
