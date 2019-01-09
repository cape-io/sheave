const { handleResponse } = require('./providers')
const { name, version } = require('./package.json')

/* globals Response fetch addEventListener */

function versionResponse({ pathname }) {
  return (pathname === '/_version.json') ? new Response(JSON.stringify({ name, version })) : false
}

function handler(getProxyInfo, event) {
  const info = getProxyInfo(event.request)
  return versionResponse(info) || fetch(...info.args)
    .then(handleResponse(info))
    .catch(console.error)
}

function registerFunction(getProxyInfo) {
  addEventListener('fetch', (event) => {
    event.respondWith(handler(getProxyInfo, event))
  })
}

module.exports = {
  handler,
  registerFunction,
}
