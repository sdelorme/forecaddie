import { BASE_URL, CLIENT_CONFIG } from './config'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function isRetryableError(error: unknown): boolean {
  // Retry on network errors and timeouts
  if (error instanceof TypeError) return true // Network error
  if (error instanceof DOMException && error.name === 'AbortError') return true // Timeout
  return false
}

export const createDataGolfClient = () => {
  return async function fetchFromDataGolf<T>(
    endpoint: string,
    options?: {
      revalidate?: number
      tags?: string[]
      params?: Record<string, string>
      headers?: Record<string, string>
    }
  ): Promise<T> {
    const apiKey = process.env.DATA_GOLF_API_KEY
    if (!apiKey) {
      throw new Error('DATA_GOLF_API_KEY is not defined')
    }

    const searchParams = new URLSearchParams({
      key: apiKey,
      ...options?.params
    })

    const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= CLIENT_CONFIG.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(CLIENT_CONFIG.TIMEOUT_MS),
          next: {
            revalidate: options?.revalidate,
            tags: options?.tags
          },
          headers: options?.headers
        })

        if (!response.ok) {
          // Don't retry client errors (4xx) - they won't fix themselves
          const error = new Error(`DataGolf API error: ${response.status}`)
          if (response.status >= 400 && response.status < 500) {
            throw error
          }
          // Server errors (5xx) are retryable
          lastError = error
          throw error
        }

        const rawData = await response.json()
        return rawData as T
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        const isLastAttempt = attempt === CLIENT_CONFIG.MAX_RETRIES
        const shouldRetry = !isLastAttempt && isRetryableError(error)

        if (shouldRetry) {
          const delayMs = CLIENT_CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt)
          console.warn(
            `DataGolf API request failed (attempt ${attempt + 1}/${CLIENT_CONFIG.MAX_RETRIES + 1}), retrying in ${delayMs}ms:`,
            endpoint
          )
          await delay(delayMs)
        } else {
          console.error('DataGolf API error:', error)
          throw lastError
        }
      }
    }

    // Should never reach here, but TypeScript needs it
    throw lastError ?? new Error('DataGolf API request failed')
  }
}

export const dataGolfClient = createDataGolfClient()
