import test from 'ava'

import { toCapitals } from '../src/capitals.mjs'

test('resolve alpha2 & numeric', t => {
  const capitals = toCapitals('AD', ['Andorra la Vella'])

  t.deepEqual(capitals, [
    {
      name: 'Andorra la Vella',
      alpha2: 'AD-04',
      alpha3: 'AND',
      numeric: '020'
    }
  ])
})
