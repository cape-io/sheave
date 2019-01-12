const { handler, registerFunction } = require('./server')
const { getPath, getProxyInfo } = require('./utils')
const getRouter = require('./routes')

module.exports = {
  getPath,
  getProxyInfo,
  getRouter,
  handler,
  registerFunction,
}
