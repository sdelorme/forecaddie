import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Clean up the DOM after each test
// In Jest with Create React App, this happens automatically
// In Vitest, we need to do it explicitly
afterEach(() => {
  cleanup()
})

// The jest-dom import adds matchers like:
// - toBeInTheDocument()
// - toHaveTextContent()
// - toBeVisible()
// - toHaveClass()
// - etc.
//
// In Jest you'd use: import '@testing-library/jest-dom'
// The /vitest suffix makes it work with Vitest's expect
