/**
 * Hydra Integration Strategy for Express Framework 
 * (https://expressjs.com/)
 */

'use strict';
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
            let routes = service._router.stack.filter(stack => stack.route).map(r => r.route);
            await hydra.registerRoutes(routes.reduce((arr, route) => {
                Object.keys(route.methods).forEach(method => arr.push(`[${method.toUpperCase()}]${route.path}`));
                return arr;
            }, []));

            // starting express server
            let server = service.listen(config.hydra.servicePort, config.hydra.serviceIP, (err) => err ? reject(err) : resolve(service));

            // registering server.close callback 
            factory.on('hydra:beforeShutdown', () => server.close());
        } catch (err) {
            reject(err);
        }
    });
}