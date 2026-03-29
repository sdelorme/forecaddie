'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { Menu, X, Loader2, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/supabase/hooks/use-auth'

const publicRoutes = [
  { href: '/', label: 'Home' },
  { href: '/odds', label: 'Odds' },
  { href: '/events', label: 'PGA Schedule' },
  { href: '/players', label: 'Players' }
]

const authRoutes = [{ href: '/dashboard', label: 'Dashboard' }]

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

  const visibleRoutes = user ? [...publicRoutes, ...authRoutes] : publicRoutes

  return (
    <nav className="bg-primary sticky top-0 z-50 w-full border-b border-primary/20" aria-label="Main navigation">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Link href="/" className="flex-shrink-0">
            <Image src="/CaddieBetLogo.png" alt="Forecaddie" width={120} height={80} className="cursor-pointer" />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {visibleRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-secondary/80 text-secondary',
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

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5 text-secondary" /> : <Menu className="h-5 w-5 text-secondary" />}
        </Button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-primary/95 border-t border-primary/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {visibleRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-secondary/80 text-secondary',
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
