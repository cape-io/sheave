const { flow, get } = require('lodash/fp')
const createFetchArgs = require('./fetchArgs')
const createOnResponse = require('./onResponse')

const getDropboxPath = flow(get('args[1].headers.Dropbox-API-Arg'), JSON.parse, get('path'))

module.exports = {
  createFetchArgs,
  createOnResponse,
  getDropboxPath,
}
