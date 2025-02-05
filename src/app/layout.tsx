import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'
import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'
import { MOCK_PLAYERS } from '@/lib/mock-data'
import { ScrollWrapper } from '@/components/providers/scroll-wrapper'

const lora = Lora({ subsets: ['latin'] })

// This needs to be moved to a separate metadata route for the client component
export const metadata: Metadata = {
  title: 'CaddieBet',
  description: 'Make smarter golf betting decisions',
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
          <Header leaderboardData={MOCK_PLAYERS} />
        </ScrollWrapper>
        <main className="flex-1 mt-[144px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
