/* eslint-disable no-async-promise-executor */
/**
 * Hydra Integration Strategy for Native Hydra Services
 * (https://www.hydramicroservice.com)
 */

module.exports = factory => ({
  build: config =>
    new Promise(async (resolve, reject) => {
      try {
        if (config.bootstrap) {
          await config.bootstrap(factory.getHydra(), factory)
        }

        resolve(factory.getHydra())
      } catch (err) {
        reject(err)
      }
    }),

  sync: async () => Promise.resolve(factory.getHydra())
})
