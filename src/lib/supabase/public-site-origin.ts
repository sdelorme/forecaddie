/**
 * Canonical site origin for Supabase auth redirects (e.g. magic link `emailRedirectTo`).
 *
 * Production: set NEXT_PUBLIC_SITE_URL to your public HTTPS origin (no trailing slash).
 * Local: leave unset to follow the browser, or set http://localhost:3000 to pin links
 * when opening the app via 127.0.0.1 or another host.
 */
export function resolvePublicSiteOrigin(configuredRaw: string | undefined, browserOrigin: string | undefined): string {
  const configured = configuredRaw?.trim()
  if (configured) {
    const normalized = configured.replace(/\/$/, '')
    try {
      return new URL(normalized).origin
    } catch {
      if (browserOrigin) {
        console.warn('Invalid NEXT_PUBLIC_SITE_URL; using browser origin for auth redirects')
        return browserOrigin
      }
      return 'http://localhost:3000'
    }
  }
  if (browserOrigin) return browserOrigin
  return 'http://localhost:3000'
}

export function getPublicSiteOrigin(): string {
  return resolvePublicSiteOrigin(
    process.env.NEXT_PUBLIC_SITE_URL,
    typeof window !== 'undefined' ? window.location.origin : undefined
  )
}
