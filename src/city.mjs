import { iso31662 as cityCodes } from 'iso-3166'

import { words } from './util.mjs'

export const toCity = (city) => {
  const { name } = city

  const alpha2candidates = cityCodes.filter(cityCode => {
    const cityCodeName = words(cityCode.name)
    return cityCodeName.includes(name.toLowerCase())
  })

  if (!alpha2candidates.length) return city

  city.alpha2 = alpha2candidates.reduce((acc, item) => {
    if (!item.parent.includes('-')) acc = item
    return acc
  }).code

  return city
}
