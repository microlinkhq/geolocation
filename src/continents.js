import { continents } from 'countries-list'

const CONTINENTS = Object.fromEntries(
  Object.entries(continents).map(([alpha2, name]) => [
    name,
    alpha2
  ])
)

export const toContinent = name => ({
  name,
  alpha2: CONTINENTS[name]
})
