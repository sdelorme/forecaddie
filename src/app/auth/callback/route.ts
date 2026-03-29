import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Sanitize redirect path to prevent open redirect vulnerabilities.
 * Only allows relative paths starting with '/'.
 */
function sanitizeRedirectPath(redirect: string | null): string {
  if (!redirect) return '/dashboard'
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
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        const {
          data: { user }
        } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase.from('user_profiles').select('username').eq('id', user.id).single()

          if (!profile?.username) {
            return NextResponse.redirect(`${origin}/setup`)
          }
        }

        return NextResponse.redirect(`${origin}${redirect}`)
      }
    } catch (err) {
      console.error('Auth callback error:', err)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
