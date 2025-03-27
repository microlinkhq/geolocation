const { ipVersion } = require('./is-ip')

const toIPv6 = address => {
  const octets = address.split('.').map(Number)
  return ['::', 'ffff']
    .concat(octets.map(octet => octet.toString(16).padStart(2, '0')))
    .join(':')
}

const toIP = address => {
  const version = ipVersion(address)
  return {
    address,
    v4: version === 4 ? address : null,
    v6: version === 6 ? address : toIPv6(address)
  }
}

module.exports = { toIP }
