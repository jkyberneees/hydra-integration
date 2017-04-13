/**
 * Hydra Integration Strategy for Sails.js Framework 
 * (http://sailsjs.com/)
 */

'use strict';
module.exports = (factory) => {
    const hydra = factory.getHydra();

    // settings default config for sails
    factory.config = Object.assign({
        sails: {
            methods: ['put', 'get', 'delete', 'head', 'patch', 'post']
        }
    }, factory.config);

    return {
        build: (config) => {
            return Promise.reject('Unsupported operation!');
        },
        sync: async(sails, config) => {
            // registering hydra routes
            let hydraRoutes = [];
            config.sails.methods.forEach((method) => {
                for (let route of sails.hooks.http.app.routes[method]) {
                    let hRoute = `[${method.toUpperCase()}]${route.path}`;
                    if (!hydraRoutes.includes(hRoute)) hydraRoutes.push(hRoute);
                }
            });

            await hydra.registerRoutes(hydraRoutes);

            return hydra;
        }
    }
}