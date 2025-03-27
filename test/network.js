'use strict'

const test = require('ava')

const { toIP } = require('../src/network')

test('resolve ip address', t => {
  const address = '88.20.18.116'

  t.deepEqual(toIP(address), {
    address: '88.20.18.116',
    v4: '88.20.18.116',
    v6: ':::ffff:58:14:12:74'
  })
})
