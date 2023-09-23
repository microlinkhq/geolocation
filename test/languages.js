import test from 'ava'

import { toLanguages } from '../src/languages.js'

test('resolve language', t => {
  t.deepEqual(toLanguages({ spa: 'Spanish' }), [{ name: 'Spanish', alpha3: 'spa', alpha2: 'es' }])
  t.deepEqual(toLanguages({ eng: 'English' }), [{ name: 'English', alpha3: 'eng', alpha2: 'en' }])
})
