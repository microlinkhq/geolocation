'use strict'

const test = require('ava')

const { toCurrencies } = require('../src/currencies')

test('resolve all the currencies', t => {
  const country = 'Palestine'
  const currencies = {
    EGP: { name: 'Egyptian pound', symbol: 'E£' },
    ILS: { name: 'Israeli new shekel', symbol: '₪' },
    JOD: { name: 'Jordanian dinar', symbol: 'JD' }
  }

  t.deepEqual(toCurrencies(country, currencies), [
    {
      code: 'EGP',
      digits: 2,
      numeric: '818',
      name: 'Egyptian pound',
      symbol: 'E£'
    },
    {
      code: 'ILS',
      digits: 2,
      numeric: '376',
      name: 'Israeli new shekel',
      symbol: '₪'
    },
    {
      code: 'JOD',
      digits: 3,
      numeric: '400',
      name: 'Jordanian dinar',
      symbol: 'JD'
    }
  ])
})

test('resolve country with "The" variations', t => {
  const currencies = toCurrencies('Cook Islands', {
    CKD: { name: 'Cook Islands dollar', symbol: '$' }
  })

  t.deepEqual(
    currencies[
      {
        code: 'CKD',
        digits: 2,
        numeric: '554',
        name: 'Cook Islands dollar',
        symbol: '$'
      }
    ]
  )
})
