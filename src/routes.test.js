const { get } = require('lodash/fp')
const { Headers } = require('node-fetch')
const { getProxyInfo } = require('./utils')
const { getRouter } = require('./routes')
const { getDropboxPath } = require('./providers/dropbox')

/* globals describe test expect */
const routeActions = [
  {
    id: 'op1',
    provider: 'b2',
    container: 'foo',
  },
  {
    id: 'op2',
    provider: 'dropbox',
    accessToken: 'abc',
    pathTemplate: ({ pathname, url }) => `/${url.subdomain}${pathname}`,
  },
  {
    id: 'foo',
    provider: 'b2',
  },
  {
    id: 'default',
    pattern: '*',
    provider: 'b2',
    pathTemplate: ({ pathname, url }) => `/cape-io/${url.subdomain}${pathname}`,
  },
]

describe('getRouter', () => {
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

    const info4 = getInfo({ ...req1, url: 'https://foo.example.com/path/name.jpg' })
    expect(info4.id).toBe('foo')
    expect(get('args[0]', info4))
      .toBe('https://f001.backblazeb2.com/file/foo/path/name.jpg')
  })
})
