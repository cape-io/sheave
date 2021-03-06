const {
  constant, omit, set,
} = require('lodash/fp')
const { Headers } = require('node-fetch')
const { getDropboxPath } = require('./providers/dropbox')

/* globals describe test expect */
const {
  getPath, getPathname, getProxyInfo, parseUrl,
} = require('./utils')

const req1 = {
  headers: new Headers({
    referer: 'https://sheave.cape.io/',
  }),
  url: 'https://usr:pw@f001.bz2.com:80/file/path/index.html?foo=bar',
}

describe('getInfo', () => {
  test('should add default ext', () => {
    expect(getPathname('/filename')).toBe('/filename.html')
  })
  test('should add default index file', () => {
    expect(getPathname('/dir/')).toBe('/dir/index.html')
  })
})
describe('getPath', () => {
  test('use path prop if already set', () => {
    expect(getPath({ path: '/file.png' })).toBe('/file.png')
  })
  test('use template function', () => {
    const info = {
      pathTemplate: ({ pathname, url }) => `/${url.subdomain}${pathname}`,
      url: { subdomain: 'foo' },
      pathname: '/file.png',
    }
    expect(getPath(info)).toBe('/foo/file.png')
  })
  test('template string uses get', () => {
    expect(getPath({ baz: '/file.png', pathTemplate: 'baz' })).toBe('/file.png')
    expect(getPath({ baz: '/file.png', pathTemplate: 'bazz' })).toBe('')
  })
  test('prepend container string', () => {
    expect(getPath({ container: 'nori', pathname: '/file.png' })).toBe('/nori/file.png')
  })
  test('use pathname by default', () => {
    expect(getPath({ pathname: '/file.png' })).toBe('/file.png')
  })
})
describe('parseUrl', () => {
  test('should parse url and add subdomain', () => {
    const info = parseUrl(req1.url)
    expect(info.subdomain).toBe('f001')
    expect(info.hostname).toBe('f001.bz2.com')
    expect(info.port).toBe('80')
    expect(info.username).toBe('usr')
    expect(info.pathname).toBe('/file/path/index.html')
  })
})

const defaultInfo = {
  provider: 'dropbox',
  accessToken: 'key',
  path: '/example/index.html',
  pathTemplate: '/container${pathname}', // eslint-disable-line no-template-curly-in-string
}

describe('getProxyInfo', () => {
  const addRouteInfo = constant(defaultInfo)
  const getInfo = getProxyInfo(addRouteInfo)
  const info = getInfo(req1)

  test('leave headers along', () => {
    expect(info.headers).toBe(req1.headers)
  })
  test('should make a dropbox url', () => {
    expect(info.args[0]).toBe('https://content.dropboxapi.com/2/files/download')
  })
  test('should copy access to header', () => {
    expect(info.args[1].headers.Authorization).toBe('Bearer key')
  })
  test('should use path if set by addRouteInfo', () => {
    expect(info.path).toBe(defaultInfo.path)
  })
  test('add default ext to files without', () => {
    const info2 = getInfo({ ...req1, url: 'https://sheave.cape.io/foo' })
    expect(info2.pathname).toBe('/foo.html')
    expect(getDropboxPath(info2)).toBe('/example/index.html')
  })

  const defaultInfo2 = omit('path', defaultInfo)
  test('should not calculate path if pathTemplate is string to invalid info path.', () => {
    const getInfo2 = getProxyInfo(constant(defaultInfo2))
    expect(getInfo2(req1).path).toBe('')
  })
  const defaultInfo4 = set('pathTemplate', 'url.subdomain', defaultInfo2)
  test('Should get path of pathTemplate when string.', () => {
    const getInfo2 = getProxyInfo(constant(defaultInfo4))
    expect(getInfo2(req1).path).toBe('f001')
  })
  const defaultInfo3 = { ...defaultInfo2, pathTemplate: ({ pathname }) => `/container${pathname}` }
  test('should calculate path if addRouteInfo is a function', () => {
    const getInfo2 = getProxyInfo(constant(defaultInfo3))
    expect(getInfo2(req1).path).toBe('/container/file/path/index.html')
  })
  // const addInfo = constant({
  //   accessToken: process.env.DROPBOX_KAI,
  //   provider: 'dropbox',
  //   pathTemplate: '/dumper${pathname}', // eslint-disable-line no-template-curly-in-string
  // })
})
