import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const lora = Lora({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Forecaddie',
  description: 'Fore all your golf betting needs!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lora.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
