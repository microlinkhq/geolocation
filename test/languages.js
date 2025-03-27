'use strict'

const test = require('ava')

const { toLanguages } = require('../src/languages')

test('resolve language', t => {
  t.deepEqual(toLanguages({ spa: 'Spanish' }), [
    { name: 'Spanish', alpha3: 'SPA', alpha2: 'ES' }
  ])
  t.deepEqual(toLanguages({ eng: 'English' }), [
    { name: 'English', alpha3: 'ENG', alpha2: 'EN' }
  ])
})
