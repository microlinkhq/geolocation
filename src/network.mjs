import isIp from 'is-ip'

const toIPv6 = adddress => {
  const octets = adddress.split('.').map(Number)
  return ['::', 'ffff'].concat(octets.map(octet => octet.toString(16).padStart(2, '0'))).join(':')
}

export const toIP = address => {
  const version = isIp.version(address)
  const data = { address }
  if (version === 4) {
    data.v4 = address
    data.v6 = toIPv6(address)
  } else {
    data.v6 = toIPv6(address)
  }
  return data
}
