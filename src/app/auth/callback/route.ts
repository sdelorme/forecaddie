import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = sanitizeRedirectPath(searchParams.get('redirect'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  // Return to login page with error if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
