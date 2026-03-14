import { callBackend, buildResponse } from '@/lib/backend'

export async function GET() {
  const result = await callBackend('/api/v1/me', {}, true)
  return buildResponse(result)
}
