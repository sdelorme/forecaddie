import { CheckCircle2, Mail, MessageSquare, Twitter } from 'lucide-react'

export const metadata = {
  title: 'About CaddieBet - Golf Betting Intelligence',
  description: 'Learn about CaddieBet and how we help you make smarter golf betting decisions through data-driven insights and expert analysis.'
}

export default function AboutPage() {
  const features = [
    'Access to comprehensive DataGolf statistics and predictions',
    'Track and optimize your One-and-Done picks',
    'Real-time tournament leaderboards and player stats',
    'Expert analysis and betting recommendations'
  ]

  const howToUse = [
    'Create your free account to access basic features',
    'Upgrade to premium for advanced statistics and predictions',
    'Set up your player watchlist and notifications',
    'Track your betting performance over time'
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Make Smarter Golf Betting Decisions
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            CaddieBet combines advanced statistics, expert analysis, and real-time data to help you make more informed golf betting decisions.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-12 text-center">
            What We Offer
          </h2>
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

      {/* How to Use */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-12 text-center">
            Getting Started
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {howToUse.map((step, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <p className="text-white text-lg">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-secondary mb-6">
            Ready to Join?
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Start your journey to smarter golf betting today. Sign up for free or explore our premium features.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-secondary text-primary px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors">
              Sign Up Free
            </button>
            <button className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors">
              View Premium Features
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-secondary mb-12">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <a href="mailto:contact@example.com" className="flex flex-col items-center space-y-4 p-6 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors">
              <Mail className="w-8 h-8 text-secondary" />
              <h3 className="text-white font-bold">Email Us</h3>
              <p className="text-gray-300">contact@example.com</p>
            </a>
            <a href="#" className="flex flex-col items-center space-y-4 p-6 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors">
              <MessageSquare className="w-8 h-8 text-secondary" />
              <h3 className="text-white font-bold">Live Chat</h3>
              <p className="text-gray-300">Available 9am-5pm EST</p>
            </a>
            <a href="#" className="flex flex-col items-center space-y-4 p-6 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors">
              <Twitter className="w-8 h-8 text-secondary" />
              <h3 className="text-white font-bold">Twitter</h3>
              <p className="text-gray-300">@CaddieBet</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
