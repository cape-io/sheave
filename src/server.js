const { pick } = require('lodash/fp')
const reqlib = require('app-root-path').require
const { handleResponse } = require('./providers')
const sheaveInfo = require('../package.json')

const appInfo = reqlib('package.json')

/* globals Response fetch addEventListener */
const getInfo = pick(['name', 'version'])
function versionResponse({ pathname }) {
  const res = {
    function: getInfo(appInfo),
    sheave: getInfo(sheaveInfo),
  }
  return (pathname === '/_version.json') ? new Response(JSON.stringify(res)) : false
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
