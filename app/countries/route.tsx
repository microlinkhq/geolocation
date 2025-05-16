/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { getQuery, sendJSON } from '@/lib/utils'

import countries from '@/data/countries.json'

export const GET = (req: Request): Response => {
  const { searchParams } = getQuery(req)

  const filter = (() => {
    let value = searchParams.get('alpha2')

    if (value) return { key: 'alpha2', value: value.toUpperCase() }
    value = searchParams.get('alpha3')
    if (value) return { key: 'alpha3', value: value.toUpperCase() }
    return { key: 'numeric', value: searchParams.get('numeric') }
  })()

  const result = filter.value
    ? // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expression o...
      countries.find(item => item.country[filter.key] === filter.value)
    : countries

  return sendJSON(result)
}
