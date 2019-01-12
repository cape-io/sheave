# Sheave

Web request redirection! Intended for use inside `webworker` environment.

## Expected Globals

* fetch
* Response
* addEventListener

## Providers

* Backblaze B2
* Dropbox

## TODO

[x] Basic Tests
[] More Tests
[] Make it easy to redirect to any web folder. Like raw.github.

## Usage

Import or require into your project.

```javascript
const { getProxyInfo, registerFunction } = require('sheave')
```

Make a `addRouteInfo` function. The function accepts an object that contains information about the request. It must return an object that will be merged in. If you do not need different options for various routes do something like this with lodash `_.contant`.

```javascript
const getRouteInfo = _.constant({
  accessToken: process.env.DROPBOX_TOKEN,
  provider: 'dropbox',
  pathTemplate: '/dumper${pathname}',
})
```

Then you pass your `getRouteInfo` function to `getProxyInfo` and send the result of that to `registerFunction`.

```javascript
const getInfo = getProxyInfo(getRouteInfo)
registerFunction(getInfo)
```

### Directives

parse: Path or array paths that should be JSON parsed and added to response object. Example: `body` or `Dropbox-API-Result`.

* setWith: `['headers.ETag', 'headers.X-Bz-Content-Sha1', 'etag']`
* setWith: `['headers.Content-Type', 'info.pathname', 'mime']`
* move: `{ get: '', set: '' }`
* omit: Array of paths that should always be removed.
