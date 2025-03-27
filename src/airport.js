// Equatorial mean radius of Earth in meters
const EARTH_RADIUS = 6378137

// Calculate square of a number
const square = num => num * num

// Convert degrees to radians
const degreesToRadians = degrees => (degrees * Math.PI) / 180.0

// Calculate Haversine function
const haversine = (pointA, pointB) => {
  // Convert latitude and longitude from degrees to radians
  const latitudeA = degreesToRadians(pointA.latitude)
  const latitudeB = degreesToRadians(pointB.latitude)
  const longitudeA = degreesToRadians(pointA.longitude)
  const longitudeB = degreesToRadians(pointB.longitude)

  // Haversine formula
  const haversineTheta =
    square(Math.sin((latitudeB - latitudeA) / 2)) +
    Math.cos(latitudeA) *
      Math.cos(latitudeB) *
      square((longitudeB - longitudeA) / 2)

  // Calculate distance using Haversine formula
  const distance = 2 * EARTH_RADIUS * Math.asin(Math.sqrt(haversineTheta))

  return distance
}

const airport = (coordinates, airports) => {
  let closestAirport = null
  let minMeters = Infinity

  for (const airport of airports) {
    const meters = haversine(coordinates, airport)

    if (meters < minMeters) {
      minMeters = meters
      closestAirport = airport
    }
  }

  return closestAirport
}

module.exports = { airport }
