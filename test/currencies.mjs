import test from 'ava'

import { toCurrencies } from '../src/currencies.mjs'

test('resolve country with "The" variations', t => {
  const currencies = toCurrencies('Cook Islands', {
    CKD: { name: 'Cook Islands dollar', symbol: '$' }
  })

  t.deepEqual(currencies[
    {
      code: 'CKD',
      digits: 2,
      numeric: '554',
      name: 'Cook Islands dollar',
      symbol: '$'
    }
  ])
})
