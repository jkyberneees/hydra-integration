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
    build: config => Promise.reject('Unsupported operation!'),
    sync: async () => Promise.reject('Unsupported operation!'),
  })
;
