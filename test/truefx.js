/* global describe it */
/* eslint no-undef: "error" */

const assert = require('assert')
const { expect } = require('chai')
const truefx = require('../lib/index')

describe('TrueFX', function () {
  describe('authenticate()', function () {
    it('should have authenticate()', function () {
      expect(truefx).to.respondsTo('authenticate')
    })
  })

  describe('get()', function () {
    it('should have get()', function () {
      expect(truefx).to.respondsTo('get')
    })
  })

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
    const baseUrl = 'http://webrates.truefx.com/rates/connect.html?f=csv'

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

  describe('getSpread()', function () {
    it('should work with 5 digits pair', function () {
      const tick = {
        symbol: 'EUR/USD',
        bid: 1.00001,
        offer: 1.00006
      }
      assert.equal(truefx.getSpread(tick), 0.5)
    })

    it('should work with 3 digits pair', function () {
      const tick = {
        symbol: 'USD/JPY',
        bid: 1.002,
        offer: 1.006
      }
      assert.equal(truefx.getSpread(tick), 0.4)
    })
  })

  describe('parseCSV()', function () {
    it('should parse CSV input to correct JSON ouput', function () {
      const input = 'EUR/USD,1506717900444,1.18,159,1.18,167,1.17724,1.18328,1.17863'
      return truefx.parseCSV(input).then(res => {
        expect(res).to.eql([
          { symbol: 'EUR/USD',
            timestamp: '1506717900444',
            bid: 1.18159,
            offer: 1.18167,
            low: 1.17724,
            high: 1.18328,
            open: 1.17863,
            spread: 0.8 }
        ])
      })
    })
  })
})
