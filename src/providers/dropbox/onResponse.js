,const { find, flow } = require('lodash/fp')
const humps = require('lodash-humps')
const mime = require('mime')
const { getCacheControll, getEtag, isOk } = require('../utils')

const API_RES = 'Dropbox-API-Result'
const ROBOTS = 'x-robots-tag'
const SECURITY = 'x-content-security-policy'

const getFileInfo = flow(
  res => res.headers.get(API_RES),
  JSON.parse,
  humps
)

function normalHeaders(res) {
  const fileInfo = getFileInfo(res)

  res.headers.set('Content-Type', mime.getType(fileInfo.name))
  res.headers.set('ETag', getEtag(fileInfo.rev))
  res.headers.set('Content-Length', fileInfo.size)

  const modified = new Date(fileInfo.serverModified)
  res.headers.set('Last-Modified', modified.toUTCString())
  res.headers.set('Cache-Control', getCacheControll(modified))
}

function createOnResponse(res) {
  if (isOk(res)) normalHeaders(res)
  // Adjust headers for every request.
  res.headers.delete(ROBOTS)
  res.headers.delete(SECURITY)
  res.headers.delete(API_RES)
  // res.headers.delete('vary')
  res.headers.set('Content-Disposition', 'inline')

  return res
}

module.exports = createOnResponse
