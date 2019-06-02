/**
 * Hydra Integration Strategy for Restify Framework
 * (https://github.com/restify/node-restify)
 */

module.exports = (factory) => {
  const hydra = factory.getHydra()

  return {
    build: config =>
      new Promise(async (resolve, reject) => {
        try {
          const restify = require('restify')
          const restifyplugins = require('restify-plugins')
          const service = restify.createServer(
            Object.assign(
              {
                name: config.hydra.serviceName,
                version: config.hydra.serviceVersion
              },
              config.restify || {}
            )
          )

          service.use(restifyplugins.acceptParser(service.acceptable))
          service.use(restifyplugins.queryParser())
          service.use(restifyplugins.bodyParser())
          service.get('/_health', (req, res, next) => {
            res.send(200)
            return next()
          })

          if (config.bootstrap) {
            await config.bootstrap(service, factory)
          }

          service.listen(
            config.hydra.servicePort,
            config.server.bindToServiceIP ? config.hydra.serviceIP : null,
            err => (err ? reject(err) : resolve(service))
          )

          factory.on('hydra:beforeShutdown', () => service.close())
        } catch (err) {
          reject(err)
        }
      }),
    sync: async (service) => {
      // registering hydra routes
      await hydra.registerRoutes(
        Object.values(service.router.mounts)
          .map(v => v.spec)
          .filter(s => typeof s.path === 'string')
          .map(s => `[${s.method}]${s.path}`)
      )

      return hydra
    }
  }
}
