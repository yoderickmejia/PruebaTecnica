import { callBackend, buildResponse } from '@/lib/backend'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await callBackend(`/api/v1/articles/${id}`, {}, true)
  return buildResponse(result)
}
