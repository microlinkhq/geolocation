import test from 'ava'

import { toCity } from '../src/city.mjs'

test('resolve city', t => {
  const city = toCity({ name: 'Murcia' })
  t.deepEqual(city, { name: 'Murcia', alpha2: 'ES-MC' })
})
