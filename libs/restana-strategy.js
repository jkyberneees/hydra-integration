/**
 * Hydra Integration Strategy for restana framework
 * (https://github.com/jkyberneees/ana)
 */


module.exports = factory => ({
  build: config => new Promise(async (resolve, reject) => {
    try {
      const service = require('restana')(config.restana || {});
      service.get('/_health', (req, res) => res.send(200));

      if (config.bootstrap) {
        await config.bootstrap(service, factory);
      }

      service
        .start(
          config.hydra.servicePort,
          config.server.bindToServiceIP ? config.hydra.serviceIP : null,
        )
        .then(() => resolve(service))
        .catch(reject);

      factory.on('hydra:beforeShutdown', () => service.close());
    } catch (err) {
      reject(err);
    }
  }),
  sync: async (service, config) => {
    const hydra = factory.getHydra();
    await hydra.registerRoutes(service.routes());

    return hydra;
  },
});
