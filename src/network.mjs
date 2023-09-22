import { version } from 'is-ip'

const toIPv6 = adddress => {
  const octets = adddress.split('.').map(Number)
  return ['::', 'ffff'].concat(octets.map(octet => octet.toString(16).padStart(2, '0'))).join(':')
}

export const toIP = address => {
  const ipVersion = version(address)
  return {
    address,
    v4: ipVersion === 4 ? address : null,
    v6: ipVersion === 6 ? address : toIPv6(address)
  }
}
