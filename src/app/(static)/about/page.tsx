import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About Forecaddie - Golf Statistics & Tournament Tracking',
  description:
    'Forecaddie provides comprehensive PGA Tour statistics, live tournament tracking, and betting odds powered by DataGolf.'
}

export default function AboutPage() {
  const features = [
    'Live tournament leaderboards with real-time scoring data',
    'Comprehensive PGA Tour player rankings and statistics',
    'Current betting odds from major sportsbooks',
    'Full season schedule with event details'
  ]

  const comingSoon = [
    'One-and-Done league planning and pick tracking',
    'Historical performance analysis',
    'Custom player comparisons',
    'Shared planning workspaces'
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Golf Statistics & Tournament Tracking</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Forecaddie brings together real-time tournament data, player statistics, and betting odds from the DataGolf
            API in one place.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-12 text-center">What You Can Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-4 bg-gray-900 p-6 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                <p className="text-white text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-12 text-center">Coming Soon</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {comingSoon.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <p className="text-gray-400 text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-secondary mb-6">Start Exploring</h2>
          <p className="text-lg text-gray-200 mb-8">
            Check out live tournament data, player rankings, and current betting odds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/events/live-stats"
              className="bg-secondary text-primary px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
            >
              Live Leaderboard
            </Link>
            <Link
              href="/players"
              className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
            >
              Player Rankings
            </Link>
          </div>
        </div>
      </section>

      {/* Data Source */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-secondary mb-6">Powered by DataGolf</h2>
          <p className="text-lg text-gray-300">
            All statistics, predictions, and odds data are sourced from the DataGolf API, providing accurate and
            up-to-date information for PGA Tour events.
          </p>
        </div>
      </section>
    </div>
  )
}
