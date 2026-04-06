'use client'

import { useEffect, useRef } from 'react'
import LeaderboardScrollWrapper from '../providers/leaderboard-scroll-wrapper'
import Navbar from './navbar'

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    const update = () => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    }

    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()

    return () => ro.disconnect()
  }, [])

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 w-full z-50">
      <div className="header-scrolled:-translate-y-[72px]">
        <LeaderboardScrollWrapper />
        <Navbar />
      </div>
    </header>
  )
}
