# TrueFX

The TrueFX API client for Node.js. For more information, please see the [TrueFX](https://www.truefx.com/).

## Installation

```bash
npm install truefx
```

## Usage

TrueFX provides a price feed of these ten pairs by default,
EUR/USD, USD/JPY, GBP/USD, EUR/GBP, USD/CHF, EUR/JPY, EUR/CHF, USD/CAD, AUD/USD, GBP/JPY

* get all: `truefx.get()`
* get by the specific symbol: `truefx.get("EUR/USD")` or `truefx.get("eurusd")`
* get more, separated by comma: `truefx.get("EUR/USD,USD/JPY")` or `truefx.get("eurusd,usdjpy")`

```javascript
const truefx = require('truefx')
truefx.get('eurusd').then(response => {
  console.log(response)
})
```

Results

```json
[ { symbol: 'EUR/USD',
    timestamp: '1507217077873',
    bid: 1.17097,
    offer: 1.17099,
    low: 1.1705,
    high: 1.1779,
    open: 1.17615,
    spread: 0.2 } ]
```

Authorized session can access to more minor pairs. [Register](https://www.truefx.com).

AUD/CAD, AUD/CHF, AUD/JPY, AUD/NZD, CAD/CHF, CAD/JPY, CHF/JPY, EUR/AUD, EUR/CAD,
EUR/NOK, EUR/NZD, GBP/CAD, GBP/CHF, NZD/JPY, NZD/USD, USD/NOK, USD/SEK

```javascript
const truefx = require('truefx')
truefx.authenticate('username', 'password').get('audjpy').then(response => {
  console.log(response)
})
```

1. Fork it ( https://github.com/tonkla/truefx.js/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Contributors

- [tonkla](https://github.com/tonkla) Surakarn Samkaew - creator, maintainer
