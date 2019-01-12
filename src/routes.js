const {
  defaults, defaultTo, flow, get, partial,
} = require('lodash/fp')
const {
  addRoutes, defaultState, findRoute, reducer, selectRoutes,
} = require('location-info')
const { createObj } = require('prairie')

// const log = (x) => { console.log(x); return x }

// @TODO Do an exact match check against route first.

function getRouter(routeActions, settings = {}) {
  const state = reducer(defaults(defaultState, settings), addRoutes(routeActions))
  const routes = flow(createObj('locInfo'), selectRoutes)(state)
  return flow(
    get('url'),
    get(state.urlPath),
    partial(findRoute, [routes]),
    defaultTo({ error: true, errorMessage: 'No route found', provider: 'none' }),
  )
}

module.exports = getRouter
