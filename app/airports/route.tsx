import { sendJSON } from '@/lib/utils'

import airports from '@/data/airports.json'

export const GET = (): Response => sendJSON(airports)
