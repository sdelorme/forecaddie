import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-gray-400 mb-12">Last updated: March 2026</p>

          <div className="space-y-10 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Acceptance of Terms</h2>
              <p>
                By accessing or using Forecaddie, you agree to be bound by these terms. If you do not agree, please do
                not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Description of Service</h2>
              <p>
                Forecaddie is a golf statistics and tournament tracking application. It provides PGA Tour data,
                leaderboards, player rankings, betting odds, and One-and-Done league planning tools. All golf data is
                sourced from the DataGolf API.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Not Financial or Betting Advice</h2>
              <p>
                Forecaddie is an informational tool only. Nothing on this platform constitutes financial advice, betting
                advice, or a recommendation to place any wager. All betting decisions are made at your own risk and
                discretion. You are solely responsible for complying with applicable laws regarding sports betting in
                your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">User Accounts</h2>
              <p>
                You are responsible for maintaining the security of your account. You must provide a valid email address
                for authentication. You may not use the service for any unlawful purpose or in violation of any
                applicable regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Accuracy</h2>
              <p>
                While we strive to display accurate and up-to-date information, we make no warranties regarding the
                completeness, accuracy, or timeliness of any data shown on the platform. Golf statistics, odds, and
                predictions are provided by DataGolf and may be subject to delays or errors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h2>
              <p>
                Forecaddie is provided &ldquo;as is&rdquo; without warranties of any kind. We shall not be liable for
                any damages arising from the use of, or inability to use, this service, including but not limited to any
                losses incurred from betting decisions made using information displayed on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the service after changes
                constitutes acceptance of the updated terms.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
