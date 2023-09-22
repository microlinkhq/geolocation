import test from 'ava'

import { toCity } from '../src/city.mjs'

test('resolve city without alpha2', t => {
  t.deepEqual(toCity({ name: 'Murcia' }), { name: 'Murcia', alpha2: 'ES-MC', alpha3: 'ESP', numeric: '724' })
  t.deepEqual(toCity({ name: 'Andorra' }), { name: 'Andorra', alpha2: 'AD-07', alpha3: 'AND', numeric: '020' })
})

test('resolve city with parent alpha2', t => {
  t.deepEqual(toCity({ name: 'Andorra la Vella' }, 'AD'), { name: 'Andorra la Vella', alpha2: 'AD-07', alpha3: 'AND', numeric: '020' })
})
