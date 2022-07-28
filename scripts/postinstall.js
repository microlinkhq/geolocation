'use strict'

const { eeaMember, euMember } = require('is-european')
const { writeFile } = require('fs/promises')
const iso31661 = require('iso-3166')
const path = require('path')

const got = require('got').extend({
  responseType: 'json',
  resolveBodyOnly: true
})

const URL =
  'https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json'

const DESTINATION_PATH = path.resolve(__dirname, '../src/countries.json')

const toData = payload =>
  payload.map(item => {
    const {
      flag,
      cca2: alpha2,
      callingCodes,
      languages,
      currencies,
      tld
    } = item

    const { alpha3 } = iso31661.find(item => item.alpha2 === alpha2)

    return {
      flag,
      alpha3,
      alpha2,
      callingCodes,
      languages,
      currencies,
      tld,
      eeaMember: eeaMember(alpha2),
      euMember: euMember(alpha2)
    }
  })

got(URL)
  .then(async data => {
    await writeFile(DESTINATION_PATH, JSON.stringify(toData(data), null, 2))
    console.log(`Added ${data.length} countries ✨`)
  })
  .then(process.exit)
  .catch(err => console.error(err) && process.exit(1))
