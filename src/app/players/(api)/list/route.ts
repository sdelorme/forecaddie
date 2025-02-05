import { NextResponse } from 'next/server'

const PLAYER_LIST_URL = `https://feeds.datagolf.com/get-player-list?tour=pga&file_format=json&key=${process.env.DATA_GOLF_API_KEY}`

async function fetchPlayerList() {
  const response = await fetch(PLAYER_LIST_URL, {
    next: {
      revalidate: 14400 // Match the page revalidation time (4 hours)
    }
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch player list')
  }
  
  return response.json()
}

export async function GET() {
  try {
    const data = await fetchPlayerList()

    return NextResponse.json(
      { players: data },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=14400, stale-while-revalidate=86400'
        }
      }
    )
  } catch (error) {
    console.error('Player list fetch error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    )
  }
} 