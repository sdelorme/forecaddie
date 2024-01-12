async function getEvents() {
  const response = await fetch(
    `https://feeds.datagolf.com/get-schedule?tour=pga&file_format=json&key=${process.env.DATA_GOLF_API_KEY}`
  )
  return response.json()
}

export default async function FetchEvents() {
  const schedule = await getEvents()
  return (
    <>
      {schedule.schedule.map((event: { [key: string]: string }) => (
        <div key={event.event_id}>{event.event_name}</div>
      ))}
    </>
  )
}
