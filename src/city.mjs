import { iso31662 as cityCodes, iso31661Alpha2ToAlpha3, iso31661Alpha2ToNumeric } from 'iso-3166'

const words = (str, pat, uc) => {
  pat = pat || /\w+/g
  str = uc ? str : str.toLowerCase()
  return str.match(pat)
}

export const toCity = (city, parentAlpha2) => {
  const { name } = city

  const nameWords = words(name.toLowerCase())

  const alpha2candidates = cityCodes.filter(({ parent, name }) =>
    words(name).find(
      word => {
        const hasName = nameWords.includes(word.toLowerCase())
        const hasParent = parentAlpha2 ? parent === parentAlpha2 : true
        return hasName && hasParent
      }
    )
  )

  city.alpha2 = alpha2candidates.length > 0
    ? alpha2candidates.reduce((acc, item) => {
      if (!item.parent.includes('-')) acc = item
      return acc
    }).code
    : null

  const alpha2strip = city.alpha2?.split('-')[0]

  city.alpha3 = alpha2strip ? iso31661Alpha2ToAlpha3[alpha2strip] : null
  city.numeric = alpha2strip ? iso31661Alpha2ToNumeric[alpha2strip] : null

  return city
}
