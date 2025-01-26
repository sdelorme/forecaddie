import { NextResponse } from 'next/server'
import moment from 'moment'
import { TourSchedule } from '@/lib/types'

const SCHEDULE_URL = `https://feeds.datagolf.com/get-schedule?tour=pga&file_format=json&key=${process.env.DATA_GOLF_API_KEY}`

async function fetchSchedule() {
  const response = await fetch(SCHEDULE_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch schedule')
  }
  return response.json()
}

export async function GET() {
  try {
    const tourSchedule: TourSchedule = await fetchSchedule()
    const sortedEvents = tourSchedule.schedule.sort((a, b) =>
      moment(a.start_date).diff(moment(b.start_date))
    )
    return NextResponse.json({ events: sortedEvents })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      )
    }
  }
}
