const {
  defaults, defaultTo, flow, get, map, partial,
} = require('lodash/fp')
// const { condId } = require('understory')
const {
  addRoutes, defaultState, findRoute, reducer, selectRoutes,
} = require('location-info')
const { createObj, setField } = require('prairie')

// const log = (x) => { console.log(x); return x }

// @TODO Do an exact match check against route first.

const fixRoute = setField('container', ({ container, id }) => container || id)

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
  getRouter,
}
