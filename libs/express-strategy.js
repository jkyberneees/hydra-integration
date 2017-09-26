/**
 * Hydra Integration Strategy for Express Framework 
 * (https://expressjs.com/)
 */

const getRoutes = require('express-list-endpoints');

module.exports = factory => ({
  build: config =>
    new Promise(async (resolve, reject) => {
      try {
        const service = require('express')();
        service.get('/_health', (req, res) => res.sendStatus(200));

        if (config.bootstrap) {
          await config.bootstrap(service, factory);
        }

        const server = service.listen(
          config.hydra.servicePort,
          config.server.bindToServiceIP ? config.hydra.serviceIP : null,
          err => (err ? reject(err) : resolve(service))
        );

        factory.on('hydra:beforeShutdown', () => server.close());
      } catch (err) {
        reject(err);
      }
    }),

  sync: async (service) => {
    const hydra = factory.getHydra();

    const routes = getRoutes(service);
    await hydra.registerRoutes(
      routes.reduce((arr, route) => {
        route.methods.forEach(method => arr.push(`[${method.toUpperCase()}]${route.path}`));
        return arr;
      }, [])
    );

    return hydra;
  }
});
