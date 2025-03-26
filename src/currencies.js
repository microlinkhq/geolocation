const { data: currencyCodes } = require('currency-codes')

const toCurrencies = (country, currencies) =>
  Object.entries(currencies)
    .map(([code, props]) => {
      const currency = currencyCodes.find(
        currency =>
          currency.code === code ||
          currency.countries.some(
            string => country === string.replace(/ \(The\)/, '')
          )
      )
      return currency
        ? { code, digits: currency.digits, numeric: currency.number, ...props }
        : null
    })
    .filter(Boolean)

module.exports = { toCurrencies }
