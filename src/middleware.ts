import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Sanitize redirect path to prevent open redirect vulnerabilities.
 * Only allows relative paths starting with '/'.
 */
function sanitizeRedirectPath(redirect: string | null): string {
  if (!redirect) return '/dashboard'
  // Only allow relative paths starting with '/'
  // Reject protocol-relative URLs (//), external URLs, and malformed paths
  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    return '/dashboard'
  }
  return redirect
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const apiKey = publishableKey || anonKey

  if (!apiKey || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return supabaseResponse
  }

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, apiKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // Note: request.cookies.set() is used here to ensure the modified request
        // object reflects the new cookies when creating NextResponse.next().
        // This pattern is from the official Supabase SSR docs for Next.js middleware.
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      }
    }
  })

  // Refresh session if expired - important for Server Components
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Protect /dashboard route - redirect to login if not authenticated
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/login' && user) {
    const redirect = sanitizeRedirectPath(request.nextUrl.searchParams.get('redirect'))
    const url = request.nextUrl.clone()
    url.pathname = redirect
    url.searchParams.delete('redirect')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
