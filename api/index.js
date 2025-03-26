'use strict'

const send = require('send-http')

const { airport } = require('../src/airport')
const { toIP } = require('../src/network')
const { toCity } = require('../src/city')

const countries = require('../data/countries.json')
const airports = require('../data/airports.json')

const cloudflare = path =>
  fetch(`https://api.cloudflare.com/client/v4/radar/entities/${path}`, {
    headers: { authorization: process.env.CLOUDFLARE_AUTHORIZATION }
  }).then(res => res.json())

const HEADERS = { 'access-control-allow-origin': '*' }

const baseUrl = ({ headers }) =>
  `${headers['x-forwarded-proto']}://${headers['x-forwarded-host']}`

const createSend = (res, headers) => data => {
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value)
  return send(res, 200, data)
}

const handler = async (req, res) => {
  const send = createSend(res, HEADERS)
  const url = baseUrl(req)
  const searchParams = new URLSearchParams(url.split('?')[1])
  const { pathname } = new URL(url)

  if (pathname === '/headers') return send(Object.fromEntries(req.headers))
  if (pathname === '/airports') return send(airports)

  if (pathname === '/countries') {
    const filter = (() => {
      let value = searchParams.get('alpha2')
      if (value) return { key: 'alpha2', value }
      value = searchParams.get('alpha3')
      if (value) return { key: 'alpha3', value }
      return { key: 'numeric', value: searchParams.get('numeric') }
    })()

    const result = filter
      ? countries.find(({ country }) => country[filter.key] === filter.value)
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

module.exports = async (req, res) => {
  try {
    await handler(req, res)
  } catch (error) {
    console.log(req.headers)
    throw error
  }
}
