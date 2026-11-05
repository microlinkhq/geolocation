import test from 'ava'

import { GET as geolocation, OPTIONS } from '../app/api/route.js'
import { GET as airports } from '../app/airports/route.tsx'
import { GET as countries } from '../app/countries/route.tsx'
import { GET as headers } from '../app/headers/route.tsx'
import { middleware } from '../middleware.ts'

const ORIGIN = 'https://geolocation.microlink.io'

const request = (path, requestHeaders = {}) =>
  new Request(new URL(path, ORIGIN), { headers: requestHeaders })

const json = async response => {
  const body = await response.json()
  return { status: response.status, body }
}

const LOS_ANGELES_WITHOUT_CITY = {
  'cf-ipcountry': 'US',
  'cf-connecting-ip': '12.222.71.85',
  'cf-iplatitude': '34.05440',
  'cf-iplongitude': '-118.24400',
  'cf-timezone': 'America/Los_Angeles'
}

const MADRID = {
  'cf-ipcountry': 'ES',
  'cf-connecting-ip': '80.58.139.12',
  'x-vercel-ip-city': 'Madrid',
  'x-vercel-ip-latitude': '40.4163',
  'x-vercel-ip-longitude': '-3.6934',
  'x-vercel-ip-timezone': 'Europe/Madrid'
}

test('/headers echoes request headers', async t => {
  const { status, body } = await json(await headers(request('/headers', { 'x-foo': 'bar' })))
  t.is(status, 200)
  t.is(body['x-foo'], 'bar')
})

test('/airports lists airports', async t => {
  const { status, body } = await json(airports())
  t.is(status, 200)
  t.truthy(body.find(({ iata }) => iata === 'ALC'))
})

test('/countries lists countries', async t => {
  const { status, body } = await json(countries(request('/countries')))
  t.is(status, 200)
  t.truthy(body.find(({ country }) => country.name === 'Spain'))
})

for (const query of ['alpha2=es', 'alpha2=ES', 'alpha3=esp', 'numeric=724']) {
  test(`/countries?${query} finds Spain`, async t => {
    const { status, body } = await json(countries(request(`/countries?${query}`)))
    t.is(status, 200)
    t.is(body.country.name, 'Spain')
  })
}

test('/ resolves Madrid, Spain', async t => {
  const { status, body } = await json(await geolocation(request('/', MADRID)))
  t.is(status, 200)
  t.is(body.ip.address, '80.58.139.12')
  t.is(body.country.name, 'Spain')
  t.deepEqual(body.city, {
    name: 'Madrid',
    postalCode: null,
    metroCode: null,
    alpha2: 'ES-MD',
    alpha3: 'ESP',
    numeric: '724'
  })
  t.is(body.airport.iata, 'ECV')
  t.is(body.timezone, 'Europe/Madrid')
  t.is(body.headers, undefined)
})

test('/ resolves city from coordinates when the city header is missing', async t => {
  const { body } = await json(await geolocation(request('/', LOS_ANGELES_WITHOUT_CITY)))
  t.is(body.country.name, 'United States')
  t.is(body.city.name, 'Los Angeles')
  t.is(body.city.alpha3, 'USA')
  t.is(body.airport.iata, 'HHR')
})

test('/ returns an empty city when city and coordinates are missing', async t => {
  const { body } = await json(
    await geolocation(request('/', { 'cf-ipcountry': 'US', 'cf-connecting-ip': '12.222.71.85' }))
  )
  t.is(body.city.name, null)
  t.is(body.city.alpha3, null)
})

test('/?headers includes request headers', async t => {
  const { body } = await json(await geolocation(request('/?headers', MADRID)))
  t.is(body.headers['x-vercel-ip-city'], 'Madrid')
})

test('/ sends CORS headers', async t => {
  const response = await geolocation(request('/', MADRID))
  t.is(response.headers.get('access-control-allow-origin'), '*')
})

test('OPTIONS / answers the CORS preflight', async t => {
  const response = await OPTIONS()
  t.is(response.status, 204)
  t.is(response.headers.get('access-control-allow-methods'), 'GET,POST,OPTIONS')
})

test('middleware lets html requests through to the page', t => {
  const response = middleware(request('/', { accept: 'text/html,application/xhtml+xml' }))
  t.is(response.headers.get('x-middleware-next'), '1')
})
