module.exports = {
  authenticate: function (username, password) {
    this.session = `${username}:${password}:sid`
    return this
  },

  get: function (symbol = '') {
    const url = this.buildUrl(symbol)
    return url
  },

  buildUrl: function (symbol = '') {
    let baseUrl = 'https://webrates.truefx.com/rates/connect.html?f=csv'
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
