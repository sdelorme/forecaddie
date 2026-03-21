import Link from 'next/link'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-12rem)]">
      <div className="max-w-md mx-auto text-center">
        <p className="text-6xl font-bold text-secondary mb-4">404</p>
        <h1 className="text-2xl font-semibold text-white mb-4">Page not found</h1>
        <p className="text-gray-400 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="h-auto px-6 py-3 rounded-lg font-medium">
            <Link href="/">Go home</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-auto px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20"
          >
            <Link href="/events">View events</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
