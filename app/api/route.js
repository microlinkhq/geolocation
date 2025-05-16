import { airport } from '@/lib/airport'
import { toIP } from '@/lib/network'
import { toCity } from '@/lib/city'

import countries from '@/data/countries.json'
import airports from '@/data/airports.json'

import { sendJSON, getHeaders, getQuery } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const cloudflare = path =>
  fetch(`https://api.cloudflare.com/client/v4/radar/entities/${path}`, {
    headers: { authorization: process.env.CLOUDFLARE_AUTHORIZATION }
  }).then(res => res.json())

export const GET = async req => {
  const { searchParams } = getQuery(req)

  const headers = getHeaders(req)

  const countryAlpha2 = headers['cf-ipcountry'] || headers['x-vercel-ip-country']

  const findCountry = countries.find(({ country }) => country.alpha2 === countryAlpha2)

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
        postalCode: headers['cf-postal-code'] || headers['x-vercel-ip-postal-code'] || null,
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

  return sendJSON(payload)
}
