'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/class-name'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const routes = [
  {
    href: '/',
    label: 'Home',
    className: 'text-secondary'
  },
  {
    href: '/odds',
    label: 'Odds',
    className: 'text-secondary'
  },
  {
    href: '/events',
    label: 'PGA Schedule',
    className: 'text-secondary'
  },
  {
    href: '/players',
    label: 'Players',
    className: 'text-secondary'
  }
]

const authRoutes = [
  {
    href: '/login',
    label: 'Log in',
    variant: 'ghost' as const,
    className: 'text-white'
  },
  {
    href: '/signup',
    label: 'Sign Up',
    variant: 'secondary' as const,
    className: 'text-primary'
  }
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-primary sticky top-0 z-50 w-full border-b border-primary/20">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex-shrink-0">
            <Image src="/CaddieBetLogo.png" alt="CaddieBet" width={120} height={80} className="cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-secondary/80',
                route.className,
                pathname === route.href && 'text-secondary'
              )}
            >
              {route.label}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            {authRoutes.map((route) => (
              <Button
                key={route.href}
                variant={route.variant}
                asChild
                className={cn('text-sm rounded-xl', route.className)}
              >
                <Link href={route.href}>{route.label}</Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5 text-secondary" /> : <Menu className="h-5 w-5 text-secondary" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary/95 border-t border-primary/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-secondary/80',
                    route.className,
                    pathname === route.href && 'text-secondary'
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                {authRoutes.map((route) => (
                  <Button
                    key={route.href}
                    variant={route.variant}
                    asChild
                    className={cn('w-full rounded-md', route.className)}
                  >
                    <Link href={route.href} onClick={() => setMenuOpen(false)}>
                      {route.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
