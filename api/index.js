/* global Response */

import countries from '../countries.json'

import isIp from 'is-ip'

const toIPv6 = adddress => {
  const octets = adddress.split('.').map(Number)
  return ['::', 'ffff'].concat(octets.map(octet => octet.toString(16).padStart(2, '0'))).join(':')
}

const toIP = address => {
  const version = isIp.version(address)
  const data = { address }
  if (version === 4) {
    data.v4 = address
    data.v6 = toIPv6(address)
  } else {
    data.v6 = toIPv6(address)
  }
  return data
}

export const config = { runtime: 'edge' }

const baseUrl = ({ headers }) =>
  `${headers.get('x-forwarded-proto')}://${headers.get('x-forwarded-host')}`

const cloudflare = path =>
  fetch(`https://api.cloudflare.com/client/v4/radar/entities/${path}`, {
    headers: {
      authorization: process.env.CLOUDFLARE_AUTHORIZATION
    }
  }).then(res => res.json())

const getCity = input => {
  const parsedCity = decodeURIComponent(input)
  return parsedCity === 'null' ? null : parsedCity
}

export default async req => {
  const { searchParams } = new URL(req.url, baseUrl(req))

  const { headers } = req
  const countryAlpha2 =
    req.headers.get('cf-ipcountry') ?? req.headers.get('x-vercel-ip-country')

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
  } = countries.find(({ country }) => country.alpha2 === countryAlpha2)

  const address = headers.get('cf-connecting-ip') ?? headers.get('x-real-ip')

  const payload = {
    ip: toIP(address),
    city: {
      name: getCity(headers.get('cf-ipcity') ?? headers.get('x-vercel-ip-city')),
      // alpha2: `${countryAlpha2}-${headers.get('x-vercel-ip-country-region')}`
    },
    country,
    continent,
    capitals,
    currencies,
    callingCodes,
    eeaMember,
    euMember,
    languages,
    tlds,
    coordinates: {
      latitude: Number(headers.get('cf-iplatitude')),
      longitude: Number(headers.get('cf-iplongitude'))
    },
    timezone: headers.get('x-vercel-ip-timezone')
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

  return Response.json(payload, {
    headers: { 'access-control-allow-origin': '*' }
  })
}
