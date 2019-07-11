const { isPlainObject, matchesProperty, pick } = require('lodash/fp')
const { setField } = require('prairie')
const { onTrue } = require('understory')
const { handleResponse } = require('./providers')
const sheaveInfo = require('../package.json')


/* globals Response fetch addEventListener */

const sheave = pick(['name', 'version'], sheaveInfo)
const verRes = ({ version }) => ({
  function: version || { name: null, version: null },
  sheave,
})
const isVersionReq = matchesProperty('pathname', '/_version.json')
const checkVerRes = onTrue(isVersionReq, setField('response', verRes))

const dataRes = res => Promise.resolve(new Response(JSON.stringify(res)))

/**
 * Send the `args` property to `fetch()` then handleResponse before responding.
 * @param  {function} getProxyInfo [description]
 * @param  {object} event        [description]
 * @return {promise}              [description]
 */
function handler(getProxyInfo, event) {
  const info = checkVerRes(getProxyInfo(event.request))

  if (isPlainObject(info.response)) return dataRes(info.response)
  if (!info.args) return dataRes(info)
  return fetch(...info.args)
    .then(handleResponse(info))
    .catch(console.error)
}

/**
 * Register the fetch event handler function. Respond with result.
 * @param  {function} getProxyInfo A function that builds object with args.
 * @return {undefined}
 */
function registerFunction(getProxyInfo) {
  addEventListener('fetch', (event) => {
    event.respondWith(handler(getProxyInfo, event))
  })
}

module.exports = {
  handler,
  registerFunction,
}
