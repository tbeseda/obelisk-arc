/** @typedef {import("@architect/functions").HttpAsyncHandler} ArcHandler */
/** @typedef {import("@architect/functions/types/http").HttpRequest} ArcRequest */
/** @typedef {import("@architect/functions/types/http").HttpResponse} ArcResponse */
/** @typedef {import("aws-lambda").Context} LambdaContext */
/** @typedef {(request: (ArcRequest & {routeParams: Record<string, string>}), context: LambdaContext) => Promise<ArcResponse | void>} RouterHandler */

import FindMyWay from 'find-my-way'

export default class {
  rootPath
  router
  handlers = new Map()
  defaultRoute (_req, _context) {
    return { status: 404 }
  }

  constructor (options = {}) {
    const { defaultRoute, rootPath = '' } = options

    // TODO: move rootPath to mount() options
    this.rootPath = rootPath

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
   * @returns {{method, fullPath}} routes map key
   */
  on (method, path, handler) {
    const fullPath = `${this.rootPath}${path}`
    const routeKey = { method, fullPath }

    this.handlers.set(routeKey, handler)
    this.router.on(method, fullPath, () => routeKey)

    return routeKey
  }

  /**
   * Mount the router in arc.http
   * @param {object} [options] reserved for future use
   * @returns {ArcHandler}
   */
  mount (options = {}) {
    /**
     * @param {ArcRequest} req
     * @param {LambdaContext} context
     * @returns {Promise<ArcResponse>}
     */
    return async (req, context) => {
      const { method, path } = req

      const found = this.router.find(method, path)

      if (found?.handler) {
        const { params: routeParams } = found
        const payload = { ...req, routeParams }
        // @ts-ignore handler isn't "real" handler, just a pointer
        const routeKey = found.handler()
        const result = await this.handlers.get(routeKey)(payload, context)

        if (result) {
          return result
        } else {
          return this.defaultRoute(payload, context)
        }
      } else {
        return this.defaultRoute(req, context)
      }
    }
  }
}
