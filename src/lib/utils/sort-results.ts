const STATUS_ORDER: Record<string, number> = {
  finished: 0,
  mdf: 1,
  cut: 2,
  wd: 3,
  dq: 4
}

type ResultAccessors<T> = {
  status: (item: T) => string
  position: (item: T) => number | null
  score: (item: T) => number | null
  name: (item: T) => string
}

export function sortByResult<T>(items: T[], access: ResultAccessors<T>): T[] {
  return [...items].sort((a, b) => {
    const aOrd = STATUS_ORDER[access.status(a)] ?? 5
    const bOrd = STATUS_ORDER[access.status(b)] ?? 5
    if (aOrd !== bOrd) return aOrd - bOrd

    const aPos = access.position(a)
    const bPos = access.position(b)
    if (aPos !== null && bPos !== null && aPos !== bPos) return aPos - bPos
    if (aPos !== null && bPos === null) return -1
    if (aPos === null && bPos !== null) return 1

    const aScore = access.score(a)
    const bScore = access.score(b)
    if (aScore !== null && bScore !== null && aScore !== bScore) return aScore - bScore
    if (aScore !== null && bScore === null) return -1
    if (aScore === null && bScore !== null) return 1

    return access.name(a).localeCompare(access.name(b))
  })
}
