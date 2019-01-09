# Sheave

Web request redirection!

## Providers

* Backblaze B2
* Dropbox

## TODO

Make it easy to redirect to any web folder. Like raw.github.

### Directives

parse: Path or array paths that should be JSON parsed and added to response object. Example: `body` or `Dropbox-API-Result`.

* setWith: `['headers.ETag', 'headers.X-Bz-Content-Sha1', 'etag']`
* setWith: `['headers.Content-Type', 'info.pathname', 'mime']`
* move: `{ get: '', set: '' }`
* omit: Array of paths that should always be removed.
