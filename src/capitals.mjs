import { iso31662 as cityCodes, iso31661Alpha2ToAlpha3, iso31661Alpha2ToNumeric } from 'iso-3166'

import { words } from './util.mjs'

export const toCapitals = (countryAlpha2, capitals) =>
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
      capital.alpha2 = city.code
      const alpha3 = iso31661Alpha2ToAlpha3[city.code] || iso31661Alpha2ToAlpha3[countryAlpha2]
      if (alpha3) capital.alpha3 = alpha3
      const numeric = iso31661Alpha2ToNumeric[city.code] || iso31661Alpha2ToNumeric[countryAlpha2]
      if (numeric) capital.numeric = numeric
    }

    return capital
  })
