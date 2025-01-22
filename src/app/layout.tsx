import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'

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
      <body className={`${lora.className} bg-black`}>
        <div className="shadow-xl bg-green-50 rounded-lg mx-auto my-8 max-w-5xl p-4">
          {children}
        </div>
      </body>
    </html>
  )
}
