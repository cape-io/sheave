const {
  curry, eq, defaults, defaultTo, flow, overArgs, pick, propertyOf, set, stubFalse,
} = require('lodash/fp')
const {
  condId, doProp, replaceField, setField, setWith,
} = require('cape-lodash')
const { addFetchArgs } = require('./providers')

const INDEX_FILE = 'index'
const DEFAULT_EXT = '.html'

const mergeFieldsWith = curry((withId, transformer, item) => ({
  ...item,
  ...doProp(transformer, withId)(item),
}))

const parseUrl = flow(
  x => new URL(x),

)

// This is the info passed to getProxyInfo from the parent.
function getInfo(defaultInfo, domainIndex) {
  const sameProvider = defaultInfo.provider ? eq(defaultInfo.provider) : stubFalse
  return flow(
    propertyOf(domainIndex),
    defaultTo(defaultInfo),
    condId([sameProvider, defaults(defaultInfo)]),
  )
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
const getFilePath = ({ container, url: { pathname } }) => `/${container}${getPath(pathname)}`

function adjustContainer(item) {
  const { container, addSubdomain, url: { subdomain } } = item
  if (!container) return set('container', subdomain, item)
  if (addSubdomain) return set('container', `${container}/${subdomain}`, item)
  return item
}

const getProxyInfo = getRouteInfo => flow(
  pick(['headers', 'url']),
  replaceField('url', parseUrl),
  mergeFieldsWith('url.subdomain', getInfo(defaultInfo, domainIndex)),
  mergeFields(getRouteInfo),
  setField('path', getFilePath),
  addFetchArgs,
)

module.exports = {
  adjustContainer,
  getInfo,
  parseUrl,
  getProxyInfo: overArgs(getProxyInfo, [set('isDefault', true)]),
}
