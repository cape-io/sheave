function getSafeUnicode(c) {
  const unicode = `000${c.charCodeAt(0).toString(16)}`.slice(-4);
  return `\\u${unicode}`;
}
// source https://www.dropboxforum.com/t5/API-support/HTTP-header-quot-Dropbox-API-Arg-quot-could-not-decode-input-as/m-p/173823/highlight/true#M6786
function httpHeaderSafeJson(args) {
  return JSON.stringify(args).replace(/[\u007f-\uffff]/g, getSafeUnicode);
}
function getBaseURL(host) {
  return `https://${host}.dropboxapi.com/2/`;
}

function createFetchArgs({ path, accessToken, headers }) {
  const fetchOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Dropbox-API-Arg': httpHeaderSafeJson({ path }),
    },
  }
  const etag = headers.get('if-none-match')
  if (etag) fetchOptions.headers['if-none-match'] = etag
  return [getBaseURL('content') + 'files/download', fetchOptions]
}

module.exports = createFetchArgs
