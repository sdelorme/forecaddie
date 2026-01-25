'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { Menu, X, Loader2, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/supabase/hooks/use-auth'

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
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    className: 'text-secondary'
  }
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setMenuOpen(false)
  }

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
          <div className="flex items-center gap-2 ml-4">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-secondary" />
            ) : user ? (
              <Button variant="ghost" onClick={handleSignOut} className="text-sm text-white hover:text-secondary">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            ) : (
              <Button variant="secondary" asChild className="text-sm rounded-xl text-primary">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
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
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                  </div>
                ) : user ? (
                  <Button variant="ghost" onClick={handleSignOut} className="w-full text-white justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                ) : (
                  <Button variant="secondary" asChild className="w-full rounded-md text-primary">
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
