import { languages, continents, countries } from 'countries-list'
import { eeaMember, euMember } from 'is-european'
import { writeFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { toCurrencies } from '../src/currencies.mjs'
import { toCapitals } from '../src/capitals.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Language to alpha2
 * @example French --> 'fr'
 */
const LANGUAGES = Object.fromEntries(
  Object.entries(languages).map(
    ([alpha2, { name }]) => [name, alpha2]
  )
)

/**
 * Continent name to alpha 2
 * @example Africa --> AF
 */
const CONTINENTS = Object.fromEntries(
  Object.entries(continents).map(([alpha2, name]) => [
    name,
    alpha2
  ])
)

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
    const phones = countries[alpha2].phone.map(phone => `+${phone}`)

    const info = {
      country: {
        name: countryName,
        flag,
        phones,
        alpha2,
        alpha3,
        numeric,
        currencies: toCurrencies(countryName, currencies),
        eeaMember: eeaMember(alpha2),
        euMember: euMember(alpha2)
      },
      continent: { name: continentName, alpha2: CONTINENTS[continentName] },
      capitals: toCapitals(alpha2, capitals),
      languages: toLanguages(languages),
      tlds
    }

    return info
  })

fetch('https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json')
  .then(res => res.json())
  .then(async data => {
    const filepath = resolve(__dirname, '../countries.json')
    await writeFile(filepath, JSON.stringify(toData(data), null, 2))
    console.log(`Added ${data.length} countries ✨`)
  })
  .catch(error => console.error(error) || process.exit(1))
