'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/class-name'

const routes = [
  {
    href: '/',
    label: 'Home',
    className: 'text-secondary',
  },
  {
    href: '/odds',
    label: 'Odds',
    className: 'text-secondary',
  },
  {
    href: '/events',
    label: 'PGA Schedule',
    className: 'text-secondary',
  },
  {
    href: '/players',
    label: 'Players',
    className: 'text-secondary',
  },
  {
    href: '/login',
    label: 'Log in',
    className: 'text-white',
  },
  {
    href: '/signup',
    label: 'Sign Up',
    className: 'text-white',
  },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-primary">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/CaddieBetLogo.png"
              alt="CaddieBet"
              width={120}
              height={80}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Hamburger Icon */}
        <div
          className="sm:hidden flex flex-col justify-center items-center space-y-1 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div
            className={`h-1 w-6 bg-white transform transition-transform duration-300 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          ></div>
          <div
            className={`h-1 w-6 bg-white transform transition-transform duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          ></div>
          <div
            className={`h-1 w-6 bg-white transform transition-transform duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          ></div>
        </div>

        {/* Navigation Links for Desktop */}
        <div className="hidden sm:flex space-x-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                route.className,
                'hover:underline',
                pathname === route.href && 'underline'
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-primary text-center">
          <ul className="flex flex-col space-y-4 py-4">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    route.className,
                    'hover:underline',
                    pathname === route.href && 'underline'
                  )}
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar
