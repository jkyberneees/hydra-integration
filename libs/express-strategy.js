/**
 * Hydra Integration Strategy for Express Framework 
 * (https://expressjs.com/)
 */

'use strict';
const getRoutes = require('express-list-endpoints');

module.exports = (factory, config) => {
    const hydra = factory.getHydra();

    return new Promise(async(resolve, reject) => {
        try {
            let service = require('express')();
            service.get('/_health', (req, res) => res.sendStatus(200));

            if (config.bootstrap) {
                await config.bootstrap(service, factory);
            }

            // registering hydra routes
            let routes = getRoutes(service);
            await hydra.registerRoutes(routes.reduce((arr, route) => {
                route.methods.forEach(method => arr.push(`[${method.toUpperCase()}]${route.path}`));
                return arr;
            }, []));

            // starting express server
            let server = service.listen(
                config.hydra.servicePort,
                (config.server.bindToServiceIP) ? config.hydra.serviceIP : null,
                (err) => err ? reject(err) : resolve(service));

            // registering server.close callback 
            factory.on('hydra:beforeShutdown', () => server.close());
        } catch (err) {
            reject(err);
        }
    });
}