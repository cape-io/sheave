const { flow, get, identity, over, spread } = require('lodash/fp')

const { handleResponse } = require('./providers')
const { name, version } = require('./package.json')

function log(x) {
  console.log(x);
  return x
  // return x && x.then && x.then((y) => { console.log('y', y); return y }) || console.log(x) || x
}

function versionResponse({ pathname }) {
  return (pathname === '/_version.json') ? new Response(JSON.stringify({ name, version })) : false
}
function handler(getProxyInfo, event) {
  const info = getProxyInfo(event.request)
  return versionResponse(info) || fetch(...info.args)
    .then(handleResponse(info))
    .catch(console.error)
}

function createFunction(getProxyInfo) {
  addEventListener('fetch', event => {
    event.respondWith(handler(getProxyInfo, event))
  })
}

module.exports = createFunction
