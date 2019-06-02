/**
 * Hydra Integration Strategy for Hapi Framework
 * (https://hapijs.com/)
 */

module.exports = (factory) => {
  const hydra = factory.getHydra()

  return {
    build: config =>
      new Promise(async (resolve, reject) => {
        try {
          const Hapi = require('hapi')
          const service = new Hapi.Server(config.hapi || {})
          service.connection({
            port: config.hydra.servicePort,
            host: config.server.bindToServiceIP ? config.hydra.serviceIP : null
          })

          service.route({
            method: 'GET',
            path: '/_health',
            handler: (request, reply) => reply()
          })

          if (config.bootstrap) {
            await config.bootstrap(service, factory)
          }

          service.start(err => (err ? reject(err) : resolve(service)))

          factory.on('hydra:beforeShutdown', () => service.stop())
        } catch (err) {
          reject(err)
        }
      }),
    sync: async (service) => {
      // registering hydra routes
      await hydra.registerRoutes(
        service
          .table()[0]
          .table.map(
            route =>
              `[${route.method.toUpperCase()}]${route.path.replace('{', ':').replace('}', '')}`
          )
      )

      return hydra
    }
  }
}
