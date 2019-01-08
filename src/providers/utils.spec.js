const { subSeconds, subYears } = require('date-fns')
/* globals describe test expect */
const { getCacheControll, getDuration } = require('./utils')

describe('getDuration', () => {
  test('max age 1 month', () => {
    expect(getDuration(122147191)).toBe(2592000)
  })
  test('round down 3 weeks to 2', () => {
    expect(getDuration(604800 * 3)).toBe(604800 * 2)
  })
  test('new doc 5 seconds', () => {
    expect(getDuration(1)).toBe(5)
  })
})
describe('getCacheControll', () => {
  const yearAgo = subYears(new Date(), 1)
  test('max age 1 month', () => {
    expect(getCacheControll(yearAgo)).toBe('max-age=2592000')
  })
  const minAgo = subSeconds(new Date(), 55)
  test('about 1 min ago should be 5 secs', () => {
    expect(getCacheControll(minAgo)).toBe('max-age=5')
  })
})
