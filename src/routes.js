const {
  conforms, defaults, defaultTo, flow, get,
  isString, map, partial,
} = require('lodash/fp')
// const { condId } = require('understory')
const {
  addRoutes, defaultState, findRoute, reducer, selectRoutes,
} = require('location-info')
const { createObj, setField } = require('prairie')

// const log = (x) => { console.log(x); return x }

// @TODO Do an exact match check against route first.
const hasContainerString = conforms({ container: isString })
const prependContainer = ({ container, pathname }) => `/${container}${pathname}`

const prependId = ({ id, pathname }) => `/${id}${pathname}`

function compileTemplate(item) {
  if (item.pathTemplate) return item.pathTemplate
  if (hasContainerString(item)) return prependContainer
  return prependId
}

const fixRoute = setField('pathTemplate', compileTemplate)

function getRouter(routeActions, settings = {}) {
  const state = reducer(defaults(defaultState, settings), addRoutes(routeActions))
  const routes = flow(createObj('locInfo'), selectRoutes, map(fixRoute))(state)
  return flow(
    get('url'),
    get(state.urlPath),
    partial(findRoute, [routes]),
    defaultTo({ error: true, errorMessage: 'No route found', provider: 'none' }),
  )
}

module.exports = {
  compileTemplate,
  getRouter,
}
