import { NextResponse } from 'next/server'
import type { ZodSchema } from 'zod'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUUID(value: string): boolean {
  return UUID_RE.test(value)
}

export function invalidUUIDResponse(paramName: string) {
  return NextResponse.json({ error: `Invalid ${paramName} format` }, { status: 400 })
}

export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return {
      data: null,
      error: NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    const messages = result.error.issues.map((i) => i.message).join(', ')
    return {
      data: null,
      error: NextResponse.json({ error: messages }, { status: 400 })
    }
  }

  return { data: result.data, error: null }
}
