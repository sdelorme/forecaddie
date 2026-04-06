import { describe, it, expect, vi } from 'vitest'
import { resolvePublicSiteOrigin } from './public-site-origin'

describe('resolvePublicSiteOrigin', () => {
  it('uses configured URL origin when set', () => {
    expect(resolvePublicSiteOrigin('https://app.example.com/', undefined)).toBe('https://app.example.com')
    expect(resolvePublicSiteOrigin('https://app.example.com/dashboard', undefined)).toBe('https://app.example.com')
  })

  it('falls back to browser origin when unset', () => {
    expect(resolvePublicSiteOrigin(undefined, 'http://127.0.0.1:3000')).toBe('http://127.0.0.1:3000')
  })

  it('prefers configured URL over browser when both set', () => {
    expect(resolvePublicSiteOrigin('https://prod.com', 'http://localhost:3000')).toBe('https://prod.com')
  })

  it('falls back to browser origin when configured value is invalid', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(resolvePublicSiteOrigin('not-a-url', 'http://localhost:3000')).toBe('http://localhost:3000')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('uses localhost when invalid config and no browser', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(resolvePublicSiteOrigin('not-a-url', undefined)).toBe('http://localhost:3000')
    warn.mockRestore()
  })
})
