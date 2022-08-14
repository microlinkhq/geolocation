'use strict'

const { data: currencyCodes } = require('currency-codes')
const { eeaMember, euMember } = require('is-european')
const { writeFile, mkdir } = require('fs/promises')
const iso31661 = require('iso-3166')
const path = require('path')

const got = require('got').extend({
  responseType: 'json',
  resolveBodyOnly: true
})

const URL =
  'https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json'

const DESTINATION_FOLDER = path.resolve(__dirname, '../src')
const DESTINATION_PATH = path.resolve(DESTINATION_FOLDER, 'countries.json')

const toCurrencies = currencies =>
  Object.entries(currencies)
    .map(([code, props]) => {
      const currencyCode = currencyCodes.find(
        currency => currency.code === code
      )
      if (!currencyCode) return null
      const { digits, number } = currencyCode
      return { code, digits, numeric: Number(number), ...props }
    })
    .filter(Boolean)

const toData = payload =>
  payload.map(item => {
    const {
      flag,
      cca2: alpha2,
      callingCodes,
      languages,
      currencies,
      region,
      tld: tlds
    } = item

    const { alpha3, numeric, name } =
      iso31661.find(item => item.alpha2 === alpha2) || {}

    return {
      country: { name, alpha2, alpha3, numeric: Number(numeric) },
      callingCodes,
      currencies: toCurrencies(currencies),
      eeaMember: eeaMember(alpha2),
      euMember: euMember(alpha2),
      flag,
      region,
      languages,
      tlds
    }
  })

got(URL)
  .then(async data => {
    await mkdir(DESTINATION_FOLDER).catch(() => {})
    await writeFile(DESTINATION_PATH, JSON.stringify(toData(data), null, 2))
    console.log(`Added ${data.length} countries ✨`)
  })
  .then(process.exit)
  .catch(err => console.error(err) && process.exit(1))
