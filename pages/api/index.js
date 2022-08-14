/* global Response */

import countries from '@/src/countries.json'
import isIp from 'is-ip'

export const config = {
  runtime: 'experimental-edge'
}

const getCity = input => {
  const parsedCity = decodeURIComponent(input)
  return parsedCity === 'null' ? null : parsedCity
}

export default async req => {
  const headers = Object.fromEntries(req.headers)

  const countryAlpha2 =
    headers['x-vercel-ip-country'] || headers['cf-ipcountry']

  const { country, ...countryInfo } = countries.find(
    ({ alpha2 }) => alpha2 === countryAlpha2
  )

  const origin = headers['cf-connecting-ip']

  return Response.json({
    origin,
    ipVersion: isIp.version(origin),
    country,
    ...countryInfo,
    city: getCity(headers['x-vercel-ip-city']),
    latitude: headers['x-vercel-ip-latitude'],
    longitude: headers['x-vercel-ip-longitude'],
    timezone: headers['x-vercel-ip-timezone'],
    headers
  })
}
