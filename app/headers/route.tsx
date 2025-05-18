import { getHeaders, sendJSON } from '@/lib/utils'

export const GET = (req: Request): Response => sendJSON(getHeaders(Object.fromEntries(req.headers)))
