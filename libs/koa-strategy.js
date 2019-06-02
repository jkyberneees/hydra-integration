/**
 * Hydra Integration Strategy for Koa Framework
 * (http://koajs.com/)
 */
module.exports = (factory) => {
  const hydra = factory.getHydra()

  return {
    build: config =>
      new Promise(async (resolve, reject) => {
        try {
          const Koa = require('koa')
          const service = new Koa()
          const router = require('koa-router')()

          router.get('/_health', async (ctx) => {
            ctx.status = 200
          })
          service.use(router.routes())
          if (config.bootstrap) {
            await config.bootstrap(service, factory)
          }

          // starting koa server
          const server = service.listen(
            config.hydra.servicePort,
            config.server.bindToServiceIP ? config.hydra.serviceIP : null,
            err => (err ? reject(err) : resolve(service))
          )

          // registering server.close callback
          factory.on('hydra:beforeShutdown', () => server.close())
        } catch (err) {
          reject(err)
        }
      }),

    sync: async (service) => {
      await hydra.registerRoutes(
        service.middleware.reduce((arr, m) => {
          if (m.router && m.router.stack) {
            m.router.stack.forEach((route) => {
              route.methods.forEach(method => arr.push(`[${method.toUpperCase()}]${route.path}`))
            })
          }

          return arr
        }, [])
      )

      return hydra
    }
  }
}
