'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/supabase/hooks/use-auth'

const publicProductLinks = [
  { href: '/events', label: 'PGA Schedule' },
  { href: '/events/live-stats', label: 'Live Leaderboard' },
  { href: '/odds', label: 'Odds' },
  { href: '/players', label: 'Players' }
]

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' }
]

const Footer: React.FC = () => {
  const { user } = useAuth()

  const productLinks = user
    ? [...publicProductLinks, { href: '/dashboard', label: 'Dashboard' }]
    : [...publicProductLinks, { href: '/login', label: 'Sign In' }]

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex-shrink-0 mb-4">
              <Image src="/CaddieBetLogo.png" alt="Forecaddie" width={120} height={80} />
            </Link>
            <p className="text-sm text-white/60 text-center md:text-left">
              Golf statistics and tournament tracking powered by DataGolf.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-secondary mb-3">Product</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-secondary mb-3">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Forecaddie. All data sourced from DataGolf. Not financial or betting
            advice.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
