export const words = (str, pat, uc) => {
  pat = pat || /\w+/g
  str = uc ? str : str.toLowerCase()
  return str.match(pat)
}
