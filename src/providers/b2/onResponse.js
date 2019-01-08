const { getEtag } = require('../utils')

const ETAG = 'X-Bz-Content-Sha1'
const ID = 'X-Bz-File-Id'
const MODIFIED = 'X-Bz-Info-src_last_modified_millis'
const NAME = 'X-Bz-File-Name'

function createOnResponse(res) {
  res.headers.set('ETag', getEtag(res.headers.get(ETAG)))
  res.headers.delete(ETAG)

  res.headers.delete(ID)

  const lastModified = parseInt(res.headers.get(MODIFIED), 10)
  res.headers.delete(MODIFIED)
  const modified = new Date(lastModified).toUTCString()
  res.headers.set('Last-Modified', modified)

  res.headers.delete(NAME)

  return res
}

module.exports = createOnResponse
