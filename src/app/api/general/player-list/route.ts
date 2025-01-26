import { NextResponse } from 'next/server'
import { Player } from '@/lib/types'

const PLAYERS_URL = `https://feeds.datagolf.com/get-player-list?file_format=json&key=${process.env.DATA_GOLF_API_KEY}`

async function fetchPlayerList(): Promise<Player[]> {
  const response = await fetch(PLAYERS_URL)
  console.log(response)
  if (!response.ok) {
    throw new Error('Failed to fetch player list')
  }

  return response.json()
}

export async function GET() {
  try {
    const playerList = await fetchPlayerList()
    return NextResponse.json(playerList)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    )
  }
}
