/**
 * Hydra Integration Strategy for restana framework
 * (https://github.com/jkyberneees/ana)
 */
'use strict';
module.exports = (factory) => {

    return {
        build: (config) => {
            return new Promise(async(resolve, reject) => {
                try {
                    let service = require('restana')(config.restana || {});
                    service.get('/_health', (req, res) => res.send(200));

                    if (config.bootstrap) {
                        await config.bootstrap(service, factory);
                    }

                    await service.start(config.hydra.servicePort,
                        (config.server.bindToServiceIP) ? config.hydra.serviceIP : null);

                    factory.on('hydra:beforeShutdown', () => service.close());
                } catch (err) {
                    reject(err);
                }
            });
        },
        sync: async(service, config) => {
            const hydra = factory.getHydra();
            await hydra.registerRoutes(service.routes());

            return hydra;
        }
    }
}