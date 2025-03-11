import { BASE_URL } from './config'

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

    try {
      const response = await fetch(url, {
        next: {
          revalidate: options?.revalidate,
          tags: options?.tags
        },
        headers: options?.headers
      })

      if (!response.ok) {
        throw new Error(`DataGolf API error: ${response.status}`)
      }

      const rawData = await response.json()
      return rawData as T
    } catch (error) {
      console.error('DataGolf API error:', error)
      throw error
    }
  }
}

export const dataGolfClient = createDataGolfClient()
