import test from 'ava'

import { toLanguages } from '../lib/languages.js'

test('resolve language', t => {
  t.deepEqual(toLanguages({ spa: 'Spanish' }), [
    { name: 'Spanish', alpha3: 'SPA', alpha2: 'ES' }
  ])
  t.deepEqual(toLanguages({ eng: 'English' }), [
    { name: 'English', alpha3: 'ENG', alpha2: 'EN' }
  ])
})
