'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen flex items-center justify-center font-sans">
        <div className="max-w-md mx-auto text-center p-8">
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-6">We&apos;re having trouble loading the page. Please try refreshing.</p>
          <button
            onClick={reset}
            className="px-6 py-2 bg-[#006747] text-white rounded-lg hover:bg-[#005538] transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
