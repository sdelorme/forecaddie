import { NextResponse } from 'next/server'
import { TourSchedule } from '@/types/schedule'

const SCHEDULE_URL = `https://feeds.datagolf.com/get-schedule?tour=pga&file_format=json&key=${process.env.DATA_GOLF_API_KEY}`

async function fetchSchedule() {
  const response = await fetch(SCHEDULE_URL, {
    next: {
      revalidate: 14400 // Match the page revalidation time (4 hours)
    }
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch schedule')
  }
  
  return response.json()
}

export async function GET() {
  try {
    const tourSchedule: TourSchedule = await fetchSchedule()
    
    // Sort events by date using native Date for better performance
    const sortedEvents = tourSchedule.schedule.sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )

    return NextResponse.json(
      { events: sortedEvents },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=14400, stale-while-revalidate=86400'
        }
      }
    )
  } catch (error) {
    console.error('Schedule fetch error:', error)
    
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