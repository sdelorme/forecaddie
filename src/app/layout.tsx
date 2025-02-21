import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'
import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'
import { ScrollWrapper } from '@/components/providers/scroll-wrapper'
import { LiveStatsProvider } from '@/components/providers/live-stats-provider'

const lora = Lora({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CaddieBet',
  description: 'Make smarter golf bets',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${lora.className} bg-black min-h-full flex flex-col`}>
        <ScrollWrapper>
          <LiveStatsProvider>
            <Header />
          </LiveStatsProvider>
        </ScrollWrapper>
        <main className="flex-1 mt-[144px]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
