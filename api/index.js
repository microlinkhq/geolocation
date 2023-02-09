/* global Response */

import countries from '../countries.json'
import isIp from 'is-ip'

export const config = { runtime: 'edge' }

const getCity = input => {
  const parsedCity = decodeURIComponent(input)
  return parsedCity === 'null' ? null : parsedCity
}

export default async req => {
  const headers = Object.fromEntries(req.headers)

  const countryAlpha2 =
    headers['x-vercel-ip-country'] || headers['cf-ipcountry']

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

  const address = headers['cf-connecting-ip'] || headers['x-real-ip']

  return Response.json(
    {
      ip: {
        address,
        version: isIp.version(address)
      },
      city: getCity(headers['x-vercel-ip-city']),
      country,
      region: {
        alpha2: headers['x-vercel-ip-country-region']
      },
      continent,
      capitals,
      currencies,
      callingCodes,
      eeaMember,
      euMember,
      languages,
      tlds,
      coordinates: {
        latitude: Number(headers['x-vercel-ip-latitude']),
        longitude: Number(headers['x-vercel-ip-longitude'])
      },
      timezone: headers['x-vercel-ip-timezone'],
      headers
    },
    {
      headers: {
        'access-control-allow-origin': '*'
      }
    }
  )
}
