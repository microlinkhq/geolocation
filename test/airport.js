import test from 'ava'

import { closestAirport } from '../src/airport.js'

const coordinates = {
  latitude: 47.56360,
  longitude: 19.09470
}

const airports = [
  {
    iata: 'ZTH',
    name: 'Dionysios Solomos Airport',
    latitude: 37.7509002686,
    longitude: 20.8843002319
  },
  {
    iata: 'BUD',
    name: 'Budapest Ferenc Liszt International Airport',
    latitude: 47.4369010925,
    longitude: 19.2555999756
  }
]

test('get the closest airport', t => {
  t.deepEqual(closestAirport(coordinates, airports), {
    iata: 'BUD',
    name: 'Budapest Ferenc Liszt International Airport',
    latitude: 47.4369010925,
    longitude: 19.2555999756
  })
})
