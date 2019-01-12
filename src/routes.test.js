const { get } = require('lodash/fp')
const { Headers } = require('node-fetch')
const { getProxyInfo } = require('./utils')
const getRouter = require('./routes')
const { getDropboxPath } = require('./providers/dropbox')

/* globals describe test expect */

describe('getRouter', () => {
  const routeActions = [
    {
      id: 'op1',
      provider: 'b2',
      pathTemplate: '/foo${pathname}', // eslint-disable-line no-template-curly-in-string
    },
    {
      id: 'op2',
      provider: 'dropbox',
      accessToken: 'abc',
      pathTemplate: '/${url.subdomain}${pathname}', // eslint-disable-line no-template-curly-in-string
    },
    {
      id: 'default',
      pattern: '*',
      provider: 'b2',
      pathTemplate: '/cape-io/${url.subdomain}${pathname}', // eslint-disable-line no-template-curly-in-string
    },
  ]
  const settings = {
    leadingSlash: false,
    urlPath: 'subdomain',
  }
  const addRouteInfo = getRouter(routeActions, settings)
  const getInfo = getProxyInfo(addRouteInfo)

  const req1 = {
    headers: new Headers({
      referer: 'https://sheave.cape.io/',
    }),
    url: 'https://op1.example.com/',
  }
  test('getProxyInfo', () => {
    const info1 = getInfo(req1)
    expect(get('args[0]', info1)).toBe('https://f001.backblazeb2.com/file/foo/index.html')

    const info2 = getInfo({ ...req1, url: 'https://op2.example.com/foo' })
    expect(getDropboxPath(info2)).toBe('/op2/foo.html')

    const info3 = getInfo({ ...req1, url: 'https://dumper.example.com/about-us/' })
    expect(get('args[0]', info3))
      .toBe('https://f001.backblazeb2.com/file/cape-io/dumper/about-us/index.html')
  })
})
