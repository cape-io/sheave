const B2_PUBLIC = 'https://f001.backblazeb2.com/file'

function createFetchArgs({ path }) {
  const fetchOptions = {
    method: 'GET',
  }
  return [B2_PUBLIC + path, fetchOptions]
}

module.exports = createFetchArgs
