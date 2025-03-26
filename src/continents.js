const { continents } = require('countries-list')

const CONTINENTS = Object.fromEntries(
  Object.entries(continents).map(([alpha2, name]) => [name, alpha2])
)

const toContinent = name => ({
  name,
  alpha2: CONTINENTS[name]
})

module.exports = { toContinent }
