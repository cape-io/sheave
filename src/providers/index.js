const {
  defaultTo, flow, get, identity, propertyOf, stubObject,
} = require('lodash/fp')
const { setField } = require('prairie')
const b2 = require('./b2')
const dropbox = require('./dropbox')

/* globals Response */

function select(selector, path, defaultValue = null) {
  return flow(selector, get(path), defaultTo(defaultValue))
}

const getProvider = flow(get('provider'), propertyOf({ b2, dropbox }))

const getArgs = select(getProvider, 'createFetchArgs', stubObject)
const getRes = select(getProvider, 'createOnResponse', identity)

const addFetchArgs = info => setField('args', getArgs(info), info)

function handleResponse(info) {
  return response => getRes(info)(new Response(response.body, response), info)
}

module.exports = {
  addFetchArgs,
  handleResponse,
}
