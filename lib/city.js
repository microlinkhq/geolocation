import { createRequire } from 'node:module'
import { around } from 'geokdbush'
import KDBush from 'kdbush'

import {
  iso31662 as cityCodes,
  iso31661Alpha2ToAlpha3,
  iso31661Alpha2ToNumeric
} from 'iso-3166'

const require = createRequire(import.meta.url)

let cityIndex

export const nearestCity = (longitude, latitude) => {
  const points = require('cities.json')

  const index =
    cityIndex ||
    (cityIndex = (() => {
      cityIndex = new KDBush(points.length)
      for (const { lng, lat } of points) cityIndex.add(lng, lat)
      cityIndex.finish()
      return cityIndex
    })())

  const nearestIds = around(index, longitude, latitude, 1)
  const nearest = nearestIds.map(id => points[id])
  return nearest[0]
}

const words = (str, pat, uc) => {
  pat = pat || /\w+/g
  str = uc ? str : str.toLowerCase()
  return str.match(pat)
}

const isCoordinate = value => {
  const text = String(value).trim()
  return text !== '' && Number.isFinite(Number(text))
}

const hasCoordinates = ({ latitude, longitude } = {}) => {
  if (!isCoordinate(latitude) || !isCoordinate(longitude)) return false
  const lat = Number(latitude)
  const lng = Number(longitude)
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

export const toCity = (city, parentAlpha2, coordinates) => {
  if (!city.name) {
    if (!hasCoordinates(coordinates)) {
      return Object.assign(city, { name: null, alpha2: null, alpha3: null, numeric: null })
    }
    const nearest = nearestCity(coordinates.longitude, coordinates.latitude)
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
