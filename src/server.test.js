// const _ = require('lodash/fp')
const { handler } = require('./server')

/* globals describe test expect */

const event = { request: {} }

function Response(item) {
  return { item: JSON.parse(item) }
}
global.Response = Response

describe('handler', () => {
  test('handle version req', () => {
    const getProxyInfo = () => ({
      pathname: '/_version.json',
    })
    expect.assertions(1)
    return handler(getProxyInfo, event).then(({ item }) => expect(item).toEqual({
      function: { version: null, name: null },
      sheave: { version: '1.4.0', name: 'sheave' },
    }))
  })
  test('handle no response req', () => {
    const info = {
      pathname: '/foo',
    }
    const getProxyInfo = () => info
    expect.assertions(1)
    return handler(getProxyInfo, event).then(({ item }) => expect(item).toEqual(info))
  })
})
