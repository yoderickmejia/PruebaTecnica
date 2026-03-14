import { NextRequest } from 'next/server'
import { callBackend, buildResponse } from '@/lib/backend'

export async function GET(request: NextRequest) {
  const skip = request.nextUrl.searchParams.get('skip') || '0'
  const limit = request.nextUrl.searchParams.get('limit') || '20'
  const result = await callBackend(`/api/v1/saved_articles?skip=${skip}&limit=${limit}`, {}, true)
  return buildResponse(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = await callBackend('/api/v1/saved_articles', {
    method: 'POST',
    body: JSON.stringify(body),
  }, true)
  return buildResponse(result)
}
