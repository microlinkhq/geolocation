import countries from '@/src/countries.json'

export const config = {
  runtime: 'experimental-edge'
}

const getCity = input => {
  const parsedCity = decodeURIComponent(input)
  return parsedCity === 'null' ? null : parsedCity
}

export default async req => {
  const headers = Object.fromEntries(req.headers)
  const country = headers['x-vercel-ip-country'] || headers['cf-ipcountry']
  const countryInfo = countries.find(({ alpha2 }) => alpha2 === country)

  return Response.json({
    origin: headers['cf-connecting-ip'],
    city: getCity(headers['x-vercel-ip-city']),
    ...countryInfo,
    region: headers['x-vercel-ip-country-region'],
    latitude: headers['x-vercel-ip-latitude'],
    longitude: headers['x-vercel-ip-longitude'],
    timezone: headers['x-vercel-ip-timezone'],
    headers
  })
}
