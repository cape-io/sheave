const {
  cond, conforms, flow, get, getOr, isFunction, isString, pick, set, stubTrue, update,
} = require('lodash/fp')
const {
  mergeFields, setField, setFieldWith,
} = require('prairie')
const { getLocation } = require('location-info')
const { addFetchArgs } = require('./providers')

// PATHNAME Utilities to add .html file extension and /index.html for paths ending in /.

const INDEX_FILE = 'index'
const DEFAULT_EXT = '.html'

// Decide if route needs an index file
const needsIndex = pathname => !pathname || pathname.endsWith('/')
// Decide if route needs an extension added
function needsExt(pathname) {
  const lastSegment = pathname.substring(pathname.lastIndexOf('/'))
  return (lastSegment.indexOf('.') === -1)
}
const addIndex = pathname => (needsIndex(pathname) ? pathname.concat(INDEX_FILE) : pathname)
const addExt = pathname => (needsExt(pathname) ? pathname.concat(DEFAULT_EXT) : pathname)
const getPathname = pathname => addExt(addIndex(pathname))

function adjustContainer(item) {
  const { container, addSubdomain, url: { subdomain } } = item
  if (!container) return set('container', subdomain, item)
  if (addSubdomain) return set('container', `${container}/${subdomain}`, item)
  return item
}

const parseUrl = flow(
  x => new URL(x),
  getLocation,
)
const getPath = cond([
  [conforms({ path: isString }), get('path')],
  [conforms({ pathTemplate: isFunction }), item => item.pathTemplate(item)],
  [conforms({ pathTemplate: isString }), item => getOr('', item.pathTemplate, item)],
  [conforms({ container: isString }), ({ container, pathname }) => `/${container}${pathname}`],
  [stubTrue, get('pathname')],
])

// URL parse and figure out proxy path.
const getProxyInfo = addRouteInfo => flow(
  pick(['headers', 'url']),
  update('url', parseUrl),
  setFieldWith('pathname', 'url.pathname', getPathname),
  mergeFields(addRouteInfo),
  setField('path', getPath),
  addFetchArgs,
)

module.exports = {
  adjustContainer,
  getPath,
  getPathname,
  parseUrl,
  getProxyInfo,
}
