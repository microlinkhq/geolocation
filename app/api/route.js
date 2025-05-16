import { airport } from '@/lib/airport'
import { toIP } from '@/lib/network'
import { toCity } from '@/lib/city'

import countries from '@/data/countries.json'
import airports from '@/data/airports.json'

import { getQuery } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const cloudflare = path =>
  fetch(`https://api.cloudflare.com/client/v4/radar/entities/${path}`, {
    headers: { authorization: process.env.CLOUDFLARE_AUTHORIZATION }
  }).then(res => res.json())

const HEADERS = { 'access-control-allow-origin': '*' }

const getHeaders = req => {
  if (!process.env.NODE_ENV === 'development') return Object.fromEntries(req.headers)
  return {
    'x-vercel-ip-continent': 'EU',
    'cf-ipcountry': 'ES',
    'cf-timezone': 'Europe/Madrid',
    'x-vercel-ip-city': 'Madrid',
    'cf-region-code': 'MC',
    'x-vercel-forwarded-for': '162.158.123.23',
    'cf-connecting-ip': '104.28.197.62',
    'cf-iplatitude': '37.98610',
    'x-vercel-ja4-digest': 't13d1412h2_e33ad33b3d25_6b314db333b6',
    'x-vercel-ip-timezone': 'Europe/Madrid',
    host: 'geolocation.microlink.io',
    'cf-postal-code': '30001',
    'cf-ipcontinent': 'EU',
    'x-vercel-ip-postal-code': '28085',
    'cf-ray': '93f90c03cb630270-MAD',
    'x-vercel-ip-country': 'ES',
    'x-vercel-ip-country-region': 'MD',
    'x-vercel-proxy-signature':
      'Bearer 9fea86f00b223dfe1ff6703f599666cf1e33a4c5b0d0248f6eadfa97aa77e944',
    'cdn-loop': 'cloudflare; loops=1',
    'x-vercel-proxied-for': '162.158.123.23',
    'cf-region': 'Murcia',
    'x-vercel-internal-bot-check': 'skip',
    accept: '*/*',
    'x-forwarded-host': 'geolocation.microlink.io',
    'x-vercel-proxy-signature-ts': '1747211866',
    'x-vercel-internal-ingress-bucket': 'bucket0',
    forwarded:
      'for=162.158.123.23;host=geolocation.microlink.io;proto=https;sig=0QmVhcmVyIDlmZWE4NmYwMGIyMjNkZmUxZmY2NzAzZjU5OTY2NmNmMWUzM2E0YzViMGQwMjQ4ZjZlYWRmYTk3YWE3N2U5NDQ=;exp=1747211866',
    'x-forwarded-for': '162.158.123.23',
    'x-forwarded-proto': 'https',
    'x-vercel-deployment-url': 'geolocation-3cdl82fjs-microlink.vercel.app',
    'x-vercel-ip-latitude': '40.4153',
    'cf-iplongitude': '-1.12130',
    'x-vercel-ip-longitude': '-3.694',
    'accept-encoding': 'gzip, br',
    'user-agent': 'curl/8.7.1',
    'cf-visitor': '{"scheme":"https"}',
    'x-real-ip': '162.158.123.23',
    'cf-ipcity': 'Murcia',
    'x-vercel-ip-as-number': '13335',
    'x-vercel-id': 'cdg1::5j6x4-1747211566709-f447aeed0cca',
    connection: 'close'
  }
}

const sendJSON = (data, { headers, ...options } = {}) =>
  Response.json(data, {
    headers: {
      ...HEADERS,
      headers
    },
    options
  })

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
