import { eeaMember, euMember } from 'is-european'
import { countries } from 'countries-list'
import { writeFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { toCurrencies } from '../src/currencies.mjs'
import { toContinent } from '../src/continents.mjs'
import { toLanguages } from '../src/languages.mjs'
import { toCity } from '../src/city.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

fetch('https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json')
  .then(res => res.json())
  .then(async data => {
    const filepath = resolve(__dirname, '../countries.json')
    await writeFile(filepath, JSON.stringify(toData(data), null, 2))
    console.log(`Added ${data.length} countries ✨`)
  })
  .catch(error => console.error(error) || process.exit(1))
