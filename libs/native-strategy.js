/**
 * Hydra Integration Strategy for Native Hydra Services
 * (https://www.hydramicroservice.com)
 */

'use strict';
module.exports = (factory, config) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (config.bootstrap) {
                await config.bootstrap(factory.getHydra(), factory);
            }

            resolve(factory.getHydra());
        } catch (err) {
            reject(err);
        }
    });
}