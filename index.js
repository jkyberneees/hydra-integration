'use strict';

const hydra = require('hydra');
const EventEmitter = require('eventemitter2').EventEmitter2;

const FrameworkStrategies = {
    native: require('./libs/native-strategy'),
    koa: require('./libs/koa-strategy'),
    express: require('./libs/express-strategy'),
    hapi: require('./libs/hapi-strategy'),
    sails0: require('./libs/sails0-strategy'),
    restify: require('./libs/restify-strategy'),
    restana: require('./libs/restana-strategy')
    // meteor: require('./libs/meteor-strategy') work in progress
};

class HydraServiceFactory extends EventEmitter {
    constructor(config = {}) {
        super({
            wildcard: true,
            newListener: true
        });

        this.config = Object.assign({
            server: {
                bindToServiceIP: false,
            }
        }, config);
        this.config.hydra.servicePort = process.env.PORT || this.config.hydra.servicePort;
    }

    async init() {
        await hydra.init(this.config);
        this.emit('hydra:initialized', this.config.hydra);

        let info = await hydra.registerService();
        // load strategy
        let type = this.config.hydra.serviceType || 'native';
        if (FrameworkStrategies[type])
            this.strategy = FrameworkStrategies[type](this);
        else
            this.strategy = require('hydra-integration-' + type)(this);

        this.emit('hydra:registered', info);

        return this;
    }

    shutdown() {
        this.emit('hydra:beforeShutdown', this.getHydra());
        hydra.shutdown();
        this.emit('hydra:afterShutdown', this.getHydra());
    }

    getHydra() {
        return hydra;
    }

    async getService(config) {
        if ('function' === typeof (config))
            config = {
                bootstrap: config
            };
        config = Object.assign(this.config, config || {});

        if (!this.service) {
            this.service = await this.strategy.build(config);
            await this.strategy.sync(this.service);
        }

        return this.service;
    }

    async sync(service, config) {
        config = Object.assign(this.config, config || {});

        return await this.strategy.sync(service, config);
    }
}


module.exports = {
    HydraServiceFactory,
    FrameworkStrategies
}