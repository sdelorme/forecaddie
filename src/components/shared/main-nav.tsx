'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const routes = [
  {
    href: '/',
    label: 'Home',
    exact: true
  },
  {
    href: '/odds',
    label: 'Odds'
  },
  {
    href: '/events',
    label: 'PGA IntSchedule'
  },
  {
    href: '/about',
    label: 'About'
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="mx-4 flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-secondary',
            (route.exact ? pathname === route.href : pathname?.startsWith(route.href))
              ? 'text-secondary'
              : 'text-white'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
} 