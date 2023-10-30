/** @typedef {import("@architect/functions").HttpAsyncHandler} ArcHandler */
/** @typedef {import("@architect/functions/types/http").HttpRequest} ArcRequest */
/** @typedef {import("@architect/functions/types/http").HttpResponse} ArcResponse */
/** @typedef {import("aws-lambda").Context} LambdaContext */
/** @typedef {(request: (ArcRequest & {routeParams: Record<string, string>}), context: LambdaContext) => Promise<ArcResponse | void>} RouterHandler */

import FindMyWay from 'find-my-way'

export default class {
  router
  rootPath = ''
  handlers = new Map()
  defaultRoute (_req, _context) {
    return { status: 404 }
  }

  constructor (options = {}) {
    const { defaultRoute } = options

    if (defaultRoute) this.defaultRoute = defaultRoute

    this.router = FindMyWay({
      ignoreTrailingSlash: true,
      caseSensitive: false,
    })
  }

  /**
   * Register a route handler.
   * @param {FindMyWay.HTTPMethod | FindMyWay.HTTPMethod[]} method
   * @param {string} path
   * @param {RouterHandler} handler
   * @returns {{method, path}} routes map key
   */
  on (method, path, handler) {
    const routeKey = { method, path }

    this.handlers.set(routeKey, handler)
    this.router.on(method, path, () => routeKey)

    return routeKey
  }

  /**
   * Mount the router in arc.http
   * @param {object} [options] mount options
   * @param {string} [options.rootPath] root path to mount the router at
   * @returns {ArcHandler}
   */
  mount (options = {}) {
    const { rootPath } = options
    if (rootPath) this.rootPath = rootPath

    /**
     * @param {ArcRequest} req
     * @param {LambdaContext} context
     * @returns {Promise<ArcResponse>}
     */
    return async (req, context) => {
      const { method, path } = req
      // router is keyed without rootPath
      const routerPath = path.slice(this.rootPath.length)
      const found = this.router.find(method, routerPath)

      if (found?.handler) {
        const { params: routeParams } = found
        const request = { ...req, routeParams }
        // @ts-ignore handler isn't "real" handler, just a pointer
        const routeKey = found.handler()
        const handler = this.handlers.get(routeKey)
        const result = await handler(request, context)

        if (result) {
          return result
        } else {
          return this.defaultRoute(request, context)
        }
      } else {
        return this.defaultRoute(req, context)
      }
    }
  }
}
