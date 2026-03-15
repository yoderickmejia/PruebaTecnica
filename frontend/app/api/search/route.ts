import { NextRequest } from 'next/server'
import { callBackend, buildResponse } from '@/lib/backend'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || ''
  const result = await callBackend(`/api/v1/search?q=${encodeURIComponent(q)}`, {}, false)
  return buildResponse(result)
}
