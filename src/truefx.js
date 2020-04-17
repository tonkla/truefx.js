const request = require('request')
const { parseString } = require('@fast-csv/parse')

export function authenticate(username, password) {
  return `${username}:${password}:sid`
}

export function get(symbol = '', session = undefined) {
  return new Promise((resolve, reject) => {
    const url = buildUrl(symbol, session)
    request(url, (error, response, body) => {
      if (error) reject(error)
      parseCSV(body).then((output) => resolve(output))
    })
  })
}

export function parseCSV(csvStr) {
  return new Promise((resolve) => {
    const output = []
    let tick = {}
    parseString(csvStr)
      .on('data', (data) => {
        if (data.length > 0) {
          tick = {
            symbol: data[0],
            timestamp: data[1],
            bid: parseFloat(data[2] + data[3]),
            offer: parseFloat(data[4] + data[5]),
            low: parseFloat(data[6]),
            high: parseFloat(data[7]),
            open: parseFloat(data[8]),
          }
          tick.spread = parseFloat(getSpread(tick))
          output.push(tick)
        }
      })
      .on('end', () => {
        resolve(output)
      })
  })
}

export function getSpread(tick) {
  if (/jpy/.test(tick.symbol.toLowerCase())) {
    return Math.round((tick.offer - tick.bid) * 100 * 100) / 100
  } else {
    return Math.round((tick.offer - tick.bid) * 10000 * 100) / 100
  }
}

export function buildUrl(symbol = '', session = undefined) {
  let baseUrl = 'https://webrates.truefx.com/rates/connect.html?f=csv'
  if (session !== undefined) baseUrl += `&id=${session}`
  if (symbol !== '') baseUrl += `&c=${sanitizeSymbols(symbol).toUpperCase()}`
  return baseUrl
}

export function sanitizeSymbols(symbols = '') {
  if (symbols !== '' && symbols.length >= 6) {
    const _symbols = []
    symbols.split(',').forEach((s) => {
      if (s.split('/').length === 1) {
        s = [s.slice(0, 3), s.slice(3, 6)].join('/')
      }
      _symbols.push(s)
    })
    symbols = _symbols.join(',')
  }
  return symbols
}

export default {
  authenticate,
  get,
  parseCSV,
  getSpread,
  buildUrl,
  sanitizeSymbols,
}
