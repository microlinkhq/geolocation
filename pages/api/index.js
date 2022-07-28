import countries from '@/src/countries.json'

export const config = {
  runtime: 'experimental-edge'
}

const getCity = input => {
  const parsedCity = decodeURIComponent(input)
  return parsedCity === 'null' ? null : parsedCity
}

export default async req => {
  const { headers } = req
  const country = headers.get('x-vercel-ip-country')
  const countryInfo = countries.find(({ alpha2 }) => alpha2 === country)

  return Response.json({
    ip: headers.get('x-real-ip'),
    city: getCity(headers.get('x-vercel-ip-city')),
    ...countryInfo,
    region: headers.get('x-vercel-ip-country-region'),
    latitude: headers.get('x-vercel-ip-latitude'),
    longitude: headers.get('x-vercel-ip-longitude'),
    timezone: headers.get('x-vercel-ip-timezone')
  })
}
