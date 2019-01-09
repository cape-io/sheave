const {
  eq, flow, find, get,
} = require('lodash/fp')
const { isLt } = require('cape-lodash')

const durations = [
  2592000, // month
  1209600, // 2 weeks
  604800, // 1 week
  259200, // 3 days
  86400, // 1 day
  21600, // 6 hours
  3600, // 1 hour
  300, // 5 minutes
  60, // 1 minute
]

const getDuration = age => find(isLt(age), durations) || 5

function getCacheControll(modified) {
  const age = (Date.now() - modified.getTime()) / 1000
  return `max-age=${getDuration(age)}`
}
const getEtag = tag => `W/"${tag}"`

const isOk = flow(get('status'), eq(200))

module.exports = {
  getCacheControll,
  getDuration,
  getEtag,
  isOk,
}
