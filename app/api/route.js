import { airport } from '@/lib/airport'
import { toIP } from '@/lib/network'
import { toCity } from '@/lib/city'

import countries from '@/data/countries.json'
import airports from '@/data/airports.json'

import send from 'send-http'

const cloudflare = path =>
  fetch(`https://api.cloudflare.com/client/v4/radar/entities/${path}`, {
    headers: { authorization: process.env.CLOUDFLARE_AUTHORIZATION }
  }).then(res => res.json())

const HEADERS = { 'access-control-allow-origin': '*' }

const createSend = (res, headers) => data => {
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value)
  return send(res, 200, data)
}

export default async (req, res) => {
  const send = createSend(res, HEADERS)

  const { pathname, searchParams } = (() => {
    const [pathname, search] = req.url.split('?')
    return { pathname, searchParams: new URLSearchParams(search) }
  })()

  if (pathname === '/headers') return send(req.headers)
  if (pathname === '/airports') return send(airports)

  if (pathname === '/countries') {
    const filter = (() => {
      let value = searchParams.get('alpha2')
      if (value) return { key: 'alpha2', value: value.toUpperCase() }
      value = searchParams.get('alpha3')
      if (value) return { key: 'alpha3', value: value.toUpperCase() }
      return { key: 'numeric', value: searchParams.get('numeric') }
    })()

    const result = filter.value
      ? countries.find(item => item.country[filter.key] === filter.value)
      : countries

    return send(result, { headers: HEADERS })
  }

  const { headers } = req

  const countryAlpha2 =
    headers['cf-ipcountry'] || headers['x-vercel-ip-country']

  const findCountry = countries.find(
    ({ country }) => country.alpha2 === countryAlpha2
  )

  const {
    country,
    continent,
    capitals,
    callingCodes,
    currencies,
    eeaMember,
    euMember,
    languages,
    tlds
  } = findCountry

  const address = headers['cf-connecting-ip'] || headers['x-real-ip']

  const coordinates = {
    latitude: headers['cf-iplatitude'] || headers['x-vercel-ip-latitude'],
    longitude: headers['cf-iplongitude'] || headers['x-vercel-ip-longitude']
  }

  const payload = {
    ip: toIP(address),
    city: toCity(
      {
        name: headers['cf-ipcity'] || headers['x-vercel-ip-city'] || null,
        postalCode:
          headers['cf-postal-code'] ||
          headers['x-vercel-ip-postal-code'] ||
          null,
        metroCode: headers['cf-metro-code'] ?? null
      },
      countryAlpha2
    ),
    country,
    continent,
    capitals,
    currencies,
    callingCodes,
    eeaMember,
    euMember,
    languages,
    tlds,
    airport: airport(coordinates, airports),
    coordinates,
    timezone: headers['cf-timezone'] || headers['x-vercel-ip-timezone']
  }

  if (searchParams.get('headers') !== null) {
    payload.headers = Object.fromEntries(req.headers)
  }

  if (searchParams.get('asn') !== null) {
    payload.asn = await cloudflare(`asns/ip?ip=${address}`)
      .then(body => body.result.asn)
      .then(asn => ({
        id: asn.asn,
        name: asn.aka || asn.name,
        company: asn.nameLong || null,
        website: asn.website || null,
        country: { name: asn.countryName, alpha2: asn.country },
        users: asn.estimatedUsers?.estimatedUsers,
        more: `https://radar.cloudflare.com/quality/as${asn.asn}`
      }))
  }

  if (!req.headers.accept.includes('text/html')) return send(payload)

  if (searchParams.get('headers') !== null) {
    payload.headers = Object.fromEntries(req.headers)
  }

  res.setHeader('Content-Type', 'text/html;charset=utf-8')
  return send(require('../src/html.js')(payload))
}
