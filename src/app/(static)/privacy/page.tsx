import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-400 mb-12">Last updated: March 2026</p>

          <div className="space-y-10 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
              <p>
                When you create an account, we collect your email address for authentication purposes. We use magic link
                (passwordless) sign-in, so we never store passwords. We also store your planning data, including
                One-and-Done picks and plan configurations, so you can access them across sessions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h2>
              <p>Your information is used to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                <li>Authenticate your account and maintain your session</li>
                <li>Store and sync your OAD plans and picks</li>
                <li>Enable plan sharing with other users you invite</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                <li>
                  <strong className="text-gray-200">Supabase</strong> &mdash; authentication and database hosting
                </li>
                <li>
                  <strong className="text-gray-200">DataGolf</strong> &mdash; golf statistics, predictions, and odds
                  data
                </li>
                <li>
                  <strong className="text-gray-200">Vercel</strong> &mdash; application hosting
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
              <p>
                We use essential cookies to maintain your authentication session. We do not use tracking cookies or
                third-party advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to outside parties. Your planning
                data is only visible to you and any users you explicitly invite to shared plans.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Retention</h2>
              <p>
                Your account and planning data are retained as long as your account is active. You can request deletion
                of your account and associated data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <p>
                If you have questions about this privacy policy, please reach out via the contact information on our
                About page.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
