const {
  flow, get, isFunction, propertyOf,
} = require('lodash/fp')
const { setField } = require('prairie')
const b2 = require('./b2')
const dropbox = require('./dropbox')

/* globals Response */

const providers = { b2, dropbox }

const getFunc = propId => flow(get('provider'), propertyOf(providers), get(propId))

function addFetchArgs(info) {
  const fetchArgs = getFunc('createFetchArgs')(info)
  if (!isFunction(fetchArgs)) return info
  return setField('args', fetchArgs, info)
}
function handleResponse(info) {
  return (response) => {
    const res = new Response(response.body, response)
    const onResponse = getFunc('createOnResponse')(info)
    return onResponse(res, info)
  }
}

module.exports = {
  addFetchArgs,
  handleResponse,
}
