import { CheckCircle2, Clock } from 'lucide-react'
import { AboutCta } from './(components)/about-cta'

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
    'Full season schedule with event details',
    'One-and-Done league planning and pick tracking',
    'Shared planning workspaces with invite-based collaboration'
  ]

  const comingSoon = [
    'Historical performance deep-dives and trend analysis',
    'Custom player comparisons',
    'Multi-season event archive with year selector'
  ]

  return (
    <div className="min-h-screen bg-black">
      <section className="bg-primary py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Golf Statistics & Tournament Tracking</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Forecaddie brings together real-time tournament data, player statistics, and betting odds from the DataGolf
            API in one place.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-primary to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-12 text-center">What You Can Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-4 bg-gray-900 p-6 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-white text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-12 text-center">Coming Soon</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {comingSoon.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <Clock className="w-6 h-6 text-gray-500 flex-shrink-0" />
                <p className="text-gray-400 text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-secondary mb-6">Start Exploring</h2>
          <p className="text-lg text-gray-200 mb-8">
            Check out live tournament data, player rankings, and current betting odds.
          </p>
          <AboutCta />
        </div>
      </section>

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
