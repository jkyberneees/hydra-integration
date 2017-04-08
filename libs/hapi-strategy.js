/**
 * Hydra Integration Strategy for Hapi Framework 
 * (https://hapijs.com/)
 */

'use strict';
module.exports = (factory, config) => {
    const hydra = factory.getHydra();

    return new Promise(async(resolve, reject) => {
        try {
            const Hapi = require('hapi');
            const service = new Hapi.Server(config.hapi || {});
            service.connection({
                port: config.hydra.servicePort,
                host: (config.server.bindToServiceIp) ? config.hydra.serviceIP : null
            });

            service.route({
                method: 'GET',
                path: '/_health',
                handler: (request, reply) => reply()
            });

            if (config.bootstrap) {
                await config.bootstrap(service, factory);
            }

            // registering hydra routes
            await hydra.registerRoutes(service.table()[0].table.reduce((arr, route) => {
                arr.push(`[${route.method.toUpperCase()}]${route.path}`);
                return arr;
            }, []));

            // starting hapi server
            service.start(err => err ? reject(err) : resolve(service));

            // registering server.close callback 
            factory.on('hydra:beforeShutdown', () => service.stop());
        } catch (err) {
            reject(err);
        }
    });
}