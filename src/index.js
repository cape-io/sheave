const { handler, registerFunction } = require('./server')
const { getProxyInfo } = require('./utils')

module.exports = {
  getProxyInfo,
  handler,
  registerFunction,
}
