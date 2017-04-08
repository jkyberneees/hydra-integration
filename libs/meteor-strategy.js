/**
 * Hydra Integration Strategy for Meteor framework
 * (https://www.meteor.com/)
 */

'use strict';
module.exports = (factory) => {

    // TODO: Support major routers for Meteor:
    // - Iron Router
    // - Simple Router
    // - Flow Router
    return {
        build: (config) => {
            return Promise.reject('Unsupported operation!');
        },
        sync: async() => {
            return Promise.reject('Unsupported operation!');
        }
    }
}