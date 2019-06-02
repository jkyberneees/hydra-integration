/**
 * Hydra Integration Strategy for Meteor framework
 * (https://www.meteor.com/)
 */

module.exports = factory =>
  // TODO: Support major routers for Meteor:
  // - Iron Router
  // - Simple Router
  // - Flow Router
  ({
    build: config => Promise.reject(new Error('Unsupported operation!')),
    sync: async service => Promise.reject(new Error('Unsupported operation!'))
  })
