import { callBackend, buildResponse } from '@/lib/backend'

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await callBackend(`/api/v1/saved_articles/${id}`, { method: 'DELETE' }, true)
  return buildResponse(result)
}
