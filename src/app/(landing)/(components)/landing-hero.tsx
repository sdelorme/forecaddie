'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { useAuth } from '@/lib/supabase/hooks/use-auth'

const HeroSection: React.FC = () => {
  const { user } = useAuth()

  return (
    <section className="relative bg-black text-white flex items-center justify-center text-center overflow-hidden min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh] px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20 pt-16 sm:pt-12">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="relative w-[120%] -ml-[10%] aspect-[16/9] sm:w-full sm:ml-0 top-[10%] sm:top-[20%] md:top-[40%] lg:top-[50%]">
          <Image
            src="/arrow.png"
            alt=""
            fill
            className="opacity-25 pointer-events-none object-contain scale-[1.2] sm:scale-100 -translate-x-[5%] translate-y-[15%] sm:translate-y-[-15%] md:translate-y-[-25%] lg:translate-y-[-35%]"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-left w-full sm:w-2/3 sm:max-w-[66%]">
          <span className="text-white">READY TO TAKE YOUR GOLF </span>
          <span className="text-green-200">BETTING TO THE NEXT LEVEL?</span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-start">
          <Button
            asChild
            size="lg"
            className="bg-secondary text-primary rounded-xl font-bold text-lg hover:bg-secondary/90 shadow-lg h-auto px-8 py-3"
          >
            <Link href={user ? '/dashboard' : '/login'}>{user ? 'Go to Dashboard' : 'Get Started'}</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 h-auto px-8 py-3"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
