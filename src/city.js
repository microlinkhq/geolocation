'use strict'

const {
  iso31662: cityCodes,
  iso31661Alpha2ToAlpha3,
  iso31661Alpha2ToNumeric
} = require('./iso-3166')

let cityIndex

const nearestCity = (longitude, latitude) => {
  const points = require('cities.json')

  const index =
    cityIndex ||
    (cityIndex = (() => {
      const KDBush = require('./kdbush').default
      cityIndex = new KDBush(points.length)
      for (const { lng, lat } of points) cityIndex.add(lng, lat)
      cityIndex.finish()
      return cityIndex
    })())

  const { around } = require('./geokdbush')
  const nearestIds = around(index, longitude, latitude, 1)
  const nearest = nearestIds.map(id => points[id])
  return nearest[0]
}

const words = (str, pat, uc) => {
  pat = pat || /\w+/g
  str = uc ? str : str.toLowerCase()
  return str.match(pat)
}

const toCity = (city, parentAlpha2) => {
  if (!city.name) {
    const nearest = nearestCity(city.longitude, city.latitude)
    city.name = nearest.name
    city.alpha2 = nearest.country
  }

  const nameWords = words(city.name.toLowerCase())

  const alpha2candidates = cityCodes.filter(({ parent, name }) =>
    words(name).find(word => {
      const hasName = nameWords.includes(word.toLowerCase())
      const hasParent = parentAlpha2 ? parent === parentAlpha2 : true
      return hasName && hasParent
    })
  )

  if (!city.alpha2) {
    city.alpha2 =
      alpha2candidates.length > 0
        ? alpha2candidates.reduce((acc, item) => {
          if (!item.parent.includes('-')) acc = item
          return acc
        }).code
        : null
  }

  const alpha2strip = city.alpha2?.split('-')[0]

  city.alpha3 = alpha2strip ? iso31661Alpha2ToAlpha3[alpha2strip] : null
  city.numeric = alpha2strip ? iso31661Alpha2ToNumeric[alpha2strip] : null

  return city
}

module.exports = { toCity, nearestCity }
