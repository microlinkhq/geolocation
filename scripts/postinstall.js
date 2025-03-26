'use strict'

const { eeaMember, euMember } = require('is-european')
const { writeFile, mkdir } = require('fs/promises')
const { countries } = require('countries-list')
const { resolve } = require('path')

const { toCurrencies } = require('../src/currencies.js')
const { toContinent } = require('../src/continents.js')
const { toLanguages } = require('../src/languages.js')
const { toCity } = require('../src/city.js')

const mapCountries = payload =>
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

    const info = {
      country: {
        name: countryName,
        flag,
        phones: countries[alpha2].phone.map(phone => `+${phone}`),
        alpha2,
        alpha3,
        numeric,
        currencies: toCurrencies(countryName, currencies),
        eeaMember: eeaMember(alpha2),
        euMember: euMember(alpha2)
      },
      continent: toContinent(continentName),
      capitals: capitals.map(name => toCity({ name }, alpha2)),
      languages: toLanguages(languages),
      tlds
    }

    return info
  })

const mapAirports = payload =>
  Object.keys(payload)
    .map(key => {
      const { iata, name, lat, lon } = payload[key]
      return iata ? { iata, name, latitude: lat, longitude: lon } : null
    })
    .filter(Boolean)

const withFetch = (url, filename, mapper) =>
  fetch(url)
    .then(res => res.json())
    .then(async data => {
      const filepath = resolve(__dirname, `../data/${filename}.json`)
      const content = mapper(data)
      await writeFile(filepath, JSON.stringify(content, null, 2))
      console.log(`  Added ${content.length} at data/${filename} ✨`)
    })

async function main () {
  await mkdir(resolve(__dirname, '../data')).catch(() => {})
  return Promise.all([
    withFetch(
      'https://cdn.jsdelivr.net/gh/mledoze/countries/dist/countries.json',
      'countries',
      mapCountries
    ),
    withFetch(
      'https://cdn.jsdelivr.net/gh/mwgg/Airports/airports.json',
      'airports',
      mapAirports
    )
  ])
}

main().catch(error => console.error(error) || process.exit(1))
