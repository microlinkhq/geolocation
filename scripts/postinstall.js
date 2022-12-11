'use strict'

const { data: currencyCodes } = require('currency-codes')
const { eeaMember, euMember } = require('is-european')
const { countries } = require('countries-list')
const cityCodes = require('iso-3166/2.json')
const { writeFile } = require('fs/promises')
const path = require('path')

const got = require('got').extend({
  responseType: 'json',
  resolveBodyOnly: true
})

const LANGUAGES = Object.fromEntries(
  Object.entries(require('countries-list').languages).map(
    ([alpha2, { name }]) => [name, alpha2]
  )
)

const CONTINENTS = Object.fromEntries(
  Object.entries(require('countries-list').continents).map(([alpha2, name]) => [
    name,
    alpha2
  ])
)

const COUNTRIES_URL =
  'https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json'

const DIST_PATH = path.resolve(__dirname, '../countries.json')

const words = (str, pat, uc) => {
  pat = pat || /\w+/g
  str = uc ? str : str.toLowerCase()
  return str.match(pat)
}

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

const toCapitals = (capitals, countryAlpha2) =>
  capitals.filter(Boolean).map(capitalName => {
    const nameWords = words(capitalName.toLowerCase())

    const city = cityCodes.find(({ parent, name }) =>
      words(name).find(
        word =>
          nameWords.includes(word.toLowerCase()) && parent === countryAlpha2
      )
    )

    const capital = { name: capitalName }

    if (city) {
      capital.alpha2 = city.code.replace(`${countryAlpha2}-`, '')
    }

    return capital
  })

const toLanguages = languages =>
  Object.entries(languages).map(([alpha3, name]) => ({
    name,
    alpha3,
    alpha2: LANGUAGES[name]
  }))

const toData = payload =>
  payload.map(item => {
    const {
      flag,
      cca2: alpha2,
      cca3: alpha3,
      ccn3: numeric,
      callingCodes,
      languages,
      currencies,
      region: continentName,
      tld: tlds,
      capital: capitals,
      ...rest
    } = item

    const countryName = rest.name.common
    const phones = countries[alpha2].phone.split(',').map(phone => `+${phone}`)

    const info = {
      country: {
        name: countryName,
        flag,
        phones,
        alpha2,
        alpha3,
        numeric: Number(numeric),
        currencies: toCurrencies(currencies),
        eeaMember: eeaMember(alpha2),
        euMember: euMember(alpha2)
      },
      continent: { name: continentName, alpha2: CONTINENTS[continentName] },
      capitals: toCapitals(capitals, alpha2),
      languages: toLanguages(languages),
      tlds
    }

    return info
  })

got(COUNTRIES_URL)
  .then(async data => {
    await writeFile(DIST_PATH, JSON.stringify(toData(data), null, 2))
    console.log(`Added ${data.length} countries ✨`)
  })
  .then(process.exit)
  .catch(err => console.error(err) && process.exit(1))
