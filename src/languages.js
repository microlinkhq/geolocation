const { languages } = require('countries-list')

const LANGUAGES = Object.fromEntries(
  Object.entries(languages).map(([alpha2, { name }]) => [name, alpha2])
)

const toLanguages = languages =>
  Object.entries(languages).map(([alpha3, name]) => ({
    name,
    alpha3: alpha3.toUpperCase(),
    alpha2: LANGUAGES[name]?.toUpperCase() ?? null
  }))

module.exports = { toLanguages }
