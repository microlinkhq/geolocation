import test from 'ava'

import { toCity, nearestCity } from '../lib/city.js'

test('resolve city without alpha2', t => {
  t.deepEqual(toCity({ name: 'Murcia' }), {
    name: 'Murcia',
    alpha2: 'ES-MC',
    alpha3: 'ESP',
    numeric: '724'
  })
  t.deepEqual(toCity({ name: 'Andorra' }), {
    name: 'Andorra',
    alpha2: 'AD-07',
    alpha3: 'AND',
    numeric: '020'
  })
})

test('resolve city with parent alpha2', t => {
  t.deepEqual(toCity({ name: 'Andorra la Vella' }, 'AD'), {
    name: 'Andorra la Vella',
    alpha2: 'AD-07',
    alpha3: 'AND',
    numeric: '020'
  })
})

test('get nearest city', t => {
  t.deepEqual(nearestCity('-97.822', '37.751'), {
    admin1: 'KS',
    admin2: '173',
    country: 'US',
    lat: '37.63001',
    lng: '-97.78255',
    name: 'Cheney'
  })
})

test('resolve city name from coordinates when name is missing', t => {
  t.deepEqual(
    toCity({ name: null }, 'US', { latitude: '34.05440', longitude: '-118.24400' }),
    {
      name: 'Los Angeles',
      alpha2: 'US',
      alpha3: 'USA',
      numeric: '840'
    }
  )
})

test('resolve empty city when name and coordinates are missing', t => {
  const empty = { name: null, alpha2: null, alpha3: null, numeric: null }
  t.deepEqual(toCity({ name: null }, 'US'), empty)
  t.deepEqual(toCity({ name: null }, 'US', { latitude: undefined, longitude: undefined }), empty)
})

test('resolve empty city when only one coordinate is present', t => {
  const empty = { name: null, alpha2: null, alpha3: null, numeric: null }
  t.deepEqual(toCity({ name: null }, 'US', { latitude: '34.05440' }), empty)
  t.deepEqual(toCity({ name: null }, 'US', { longitude: '-118.24400' }), empty)
})

test('resolve city at zero latitude and longitude', t => {
  t.deepEqual(toCity({ name: null }, 'GH', { latitude: 0, longitude: 0 }), {
    name: 'Dixcove',
    alpha2: 'GH',
    alpha3: 'GHA',
    numeric: '288'
  })
})

test('resolve empty city when coordinates are out of range', t => {
  const empty = { name: null, alpha2: null, alpha3: null, numeric: null }
  t.deepEqual(toCity({ name: null }, 'US', { latitude: 91, longitude: 0 }), empty)
  t.deepEqual(toCity({ name: null }, 'US', { latitude: -91, longitude: 0 }), empty)
  t.deepEqual(toCity({ name: null }, 'US', { latitude: 0, longitude: 181 }), empty)
  t.deepEqual(toCity({ name: null }, 'US', { latitude: 0, longitude: -181 }), empty)
})

test('resolve city at the geographic bounds', t => {
  for (const coordinates of [
    { latitude: 90, longitude: 0 },
    { latitude: -90, longitude: 0 },
    { latitude: 0, longitude: 180 },
    { latitude: 0, longitude: -180 }
  ]) {
    t.not(toCity({ name: null }, 'US', coordinates).name, null)
  }
})

test('resolve empty city when coordinates are not numbers', t => {
  const empty = { name: null, alpha2: null, alpha3: null, numeric: null }
  t.deepEqual(toCity({ name: null }, 'US', { latitude: 'nope', longitude: 'nope' }), empty)
  t.deepEqual(toCity({ name: null }, 'US', { latitude: '', longitude: '' }), empty)
  t.deepEqual(toCity({ name: null }, 'US', { latitude: '  ', longitude: '   ' }), empty)
})
