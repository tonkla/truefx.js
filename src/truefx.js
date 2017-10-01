const csv = require('fast-csv')
const request = require('request')

const truefx = {
  authenticate: function (username, password) {
    this.session = `${username}:${password}:sid`
    return this
  },

  get: function (symbol = '') {
    return new Promise((resolve, reject) => {
      const url = this.buildUrl(symbol)
      request(url, (error, response, body) => {
        if (error) reject(error)
        this.parseCSV(body)
            .then(output => { resolve(output) })
      })
    })
  },

  parseCSV: function (csvStr) {
    return new Promise((resolve, reject) => {
      const output = []
      let tick = {}
      csv.fromString(csvStr)
        .on('data', (data) => {
          if (data.length > 0) {
            tick = {
              symbol: data[0],
              timestamp: data[1],
              bid: parseFloat(data[2] + data[3]),
              offer: parseFloat(data[4] + data[5]),
              low: parseFloat(data[6]),
              high: parseFloat(data[7]),
              open: parseFloat(data[8])
            }
            tick.spread = parseFloat(this.getSpread(tick))
            output.push(tick)
          }
        })
        .on('end', () => {
          resolve(output)
        })
    })
  },

  getSpread: function (tick) {
    if (/jpy/.test(tick.symbol.toLowerCase())) {
      return Math.round(((tick.offer - tick.bid) * 100) * 100) / 100
    } else {
      return Math.round(((tick.offer - tick.bid) * 10000) * 100) / 100
    }
  },

  buildUrl: function (symbol = '') {
    // NOTE: HTTPS raises `sslv3 alert handshake failure`
    let baseUrl = 'http://webrates.truefx.com/rates/connect.html?f=csv'
    if (this.session !== undefined) {
      baseUrl += `&id=${this.session}`
    }
    if (symbol !== '') {
      baseUrl += `&c=${this.sanitizeSymbol(symbol).toUpperCase()}`
    }
    return baseUrl
  },

  sanitizeSymbol: function (symbol = '') {
    if (symbol !== '' && symbol.length >= 6) {
      const _symbol = []
      symbol.split(',').forEach((s) => {
        if (s.split('/').length === 1) {
          s = [s.slice(0, 3), s.slice(3, 6)].join('/')
        }
        _symbol.push(s)
      })
      symbol = _symbol.join(',')
    }
    return symbol
  }
}

module.exports = truefx
