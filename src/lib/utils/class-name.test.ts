// Vitest requires explicit imports (unlike Jest's globals)
// This is the main syntax difference you'll notice
import { describe, it, expect } from 'vitest'
import { cn } from './class-name'

// describe/it/expect work exactly like Jest
describe('cn utility', () => {
  it('merges class names', () => {
    const result = cn('foo', 'bar')
    expect(result).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const result = cn('base', isActive && 'active')
    expect(result).toBe('base active')
  })

  it('handles falsy values', () => {
    const result = cn('base', false, null, undefined, 'end')
    expect(result).toBe('base end')
  })

  it('merges tailwind classes correctly', () => {
    // tailwind-merge deduplicates conflicting classes
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4') // px-4 wins over px-2
  })

  it('handles arrays of classes', () => {
    const result = cn(['foo', 'bar'], 'baz')
    expect(result).toBe('foo bar baz')
  })
})
