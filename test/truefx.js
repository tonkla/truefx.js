/* global describe it */
/* eslint no-undef: "error" */

const assert = require('assert')
const truefx = require('../lib/index')

describe('TrueFX', function () {
  describe('sanitizeUrl()', function () {
    it('should work for single symbol with slash', function () {
      assert.equal(truefx.sanitizeSymbol('eur/usd'), 'eur/usd')
    })

    it('should work for single symbol without slash', function () {
      assert.equal(truefx.sanitizeSymbol('eurusd'), 'eur/usd')
    })

    it('should work for multiple symbols with slash', function () {
      assert.equal(truefx.sanitizeSymbol('eur/usd,usd/jpy'), 'eur/usd,usd/jpy')
    })

    it('should work for multiple symbols without slash', function () {
      assert.equal(truefx.sanitizeSymbol('eurusd,usdjpy'), 'eur/usd,usd/jpy')
    })

    it('should work for multiple symbols with mixed slash', function () {
      assert.equal(truefx.sanitizeSymbol('eurusd,usd/jpy'), 'eur/usd,usd/jpy')
    })
  })

  describe('buildUrl()', function () {
    const baseUrl = 'https://webrates.truefx.com/rates/connect.html?f=csv'

    it('should work without symbol', function () {
      assert.equal(truefx.buildUrl(), baseUrl)
    })

    it('should work with symbol', function () {
      assert.equal(truefx.buildUrl('eurusd'), `${baseUrl}&c=EUR/USD`)
    })

    it('should work with authorized session', function () {
      const session = 'u:p:s'
      truefx.session = session
      assert.equal(truefx.buildUrl('eurusd'), `${baseUrl}&id=${session}&c=EUR/USD`)
    })
  })
})
