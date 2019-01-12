// const { constant } = require('lodash/fp')
const { Headers } = require('node-fetch')

/* globals describe test expect */
const { getPathname, getProxyInfo, parseUrl } = require('./utils')

const req1 = {
  headers: new Headers({
    referer: 'https://sheave.cape.io/',
  }),
  url: 'https://usr:pw@f001.bz2.com:80/file/path/index.html?foo=bar',
}
const defaultInfo = {
  provider: 'dropbox',
  accessToken: 'key',
  container: 'cape',
  addSubdomain: true,
}

describe('getInfo', () => {
  test('should add default ext', () => {
    expect(getPathname('/filename')).toBe('/filename.html')
  })
  test('should add default index file', () => {
    expect(getPathname('/dir/')).toBe('/dir/index.html')
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

describe('getProxyInfo', () => {
  // const info = getProxyInfo(defaultInfo)(req1)
  //
  // test('leave headers along', () => {
  //   expect(info.headers).toBe(req1.headers)
  // })
  // test('should make a dropbox url', () => {
  //   expect(info.args[0]).toBe('https://content.dropboxapi.com/2/files/download')
  // })
  // test('should copy access to header', () => {
  //   expect(info.args[1].headers.Authorization).toBe('Bearer key')
  // })
  // test('should add subdomain to path', () => {
  //   expect(info.path).toBe('/cape/f001/file/path/index.html')
  // })

  // test('add default ext to files without', () => {
  //   expect(getFetchArgs({ url: 'https://ddh.cape.io/index' }).args[0]).toBe(res1)
  // })
  // const res2 = 'https://f001.backblazeb2.com/file/cape-io/redux-history/index.html'
  // test('should return redux-history correctly', () => {
  //   expect(getFetchArgs({ url: 'https://redux-history.cape.io' }).args[0]).toBe(res2)
  //   expect(getFetchArgs({ url: 'https://redux-history.cape.io/' }).args[0]).toBe(res2)
  // })
  // test('handle files with ext', () => {
  //   expect(getFetchArgs({ url: 'https://redux-history.cape.io/index.html' }).args[0]).toBe(res2)
  // })
  // const dbox = 'https://content.dropboxapi.com/2/files/download'
  // test('can go to dropbox', () => {
  //   const request = { url: 'https://dumper.cape.io', headers: { get: constant() } }
  //   const info = getFetchArgs(request)
  //   expect(info.args[0]).toBe(dbox)
  //   expect(info.args[1].headers['Dropbox-API-Arg']).toBe('{"path":"/dumper/index.html"}')
  // })
})
