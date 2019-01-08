const { add, curry, flow, get, getOr, identity, overArgs, set } = require('lodash/fp')
const { doProp, setField, setWith } = require('cape-lodash')
const { addFetchArgs } = require('./providers')

const INDEX_FILE = 'index'
const DEFAULT_EXT = '.html'

const mergeFieldsWith = curry((withId, transformer, item) =>
  ({ ...item, ...doProp(transformer, withId)(item) }))

// Get subdomain value.
function parseUrl(req) {
  const { headers, url } = req
  const { hostname, pathname } = new URL(url)
  const subdomain = hostname.split('.')[0]
  return { headers, hostname, pathname, subdomain }
}

// Decide if route needs an index file
function needsIndex(pathname) {
  return !pathname || pathname.endsWith('/')
}

// Decide if route needs an extension added
function needsExt(pathname) {
  const lastSegment = pathname.substring(pathname.lastIndexOf('/'))
  return (lastSegment.indexOf('.') === -1)
}

const addIndex = pathname => (needsIndex(pathname) ? pathname.concat(INDEX_FILE) : pathname)
const addExt = pathname => (needsExt(pathname) ? pathname.concat(DEFAULT_EXT) : pathname)

const getPath = pathname => addExt(addIndex(pathname))

// Combine bucketPath for entire domain with the specific path requested.
const getFilePath = ({ container, pathname }) =>
  `/${container}${getPath(pathname)}`

function adjustContainer(item) {
  const { container, isDefault, subdomain } = item
  if (isDefault) return set('container', `${container}/${subdomain}`, item)
  if (!container) return set('container', subdomain, item)
  return item
}

const getProxyInfo = (defaultInfo, domainIndex) => flow(
  parseUrl,
  mergeFieldsWith('subdomain', subdomain => getOr(defaultInfo, subdomain, domainIndex)),
  adjustContainer,
  setField('path', getFilePath),
  addFetchArgs,
)

module.exports = {
  getProxyInfo: overArgs(getProxyInfo, [set('isDefault', true)]),
}
