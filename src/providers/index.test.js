const { addFetchArgs } = require('./')

/* globals describe test expect */

describe('addFetchArgs', () => {
  test('handle empty obj', () => {
    const info = {}
    expect(addFetchArgs(info)).toBe(info)
  })
})
