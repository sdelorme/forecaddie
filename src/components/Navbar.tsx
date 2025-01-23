'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-green-700">
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
          <Link href="/" className="text-yellow-400 hover:underline">
            Home
          </Link>
          <Link href="/odds" className="text-yellow-400 hover:underline">
            Odds
          </Link>
          <Link href="/events" className="text-yellow-400 hover:underline">
            PGA Schedule
          </Link>
          <Link href="/login" className="text-white hover:underline">
            Log in
          </Link>
          <Link href="/signup" className="text-white hover:underline">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-green-600 text-center">
          <ul className="flex flex-col space-y-4 py-4">
            <li>
              <Link href="/" className="text-yellow-400 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/odds" className="text-yellow-400 hover:underline">
                Odds
              </Link>
            </li>
            <li>
              <Link href="/events" className="text-yellow-400 hover:underline">
                PGA Schedule
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-white hover:underline">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/signup" className="text-white hover:underline">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar
