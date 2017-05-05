'use strict';

const EventEmitter = require('events');
const HydraPlugin = require('hydra/plugin');

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
        super();

        this.config = Object.assign({
            server: {
                bindToServiceIP: false,
            }
        }, config);
        this.config.hydra.servicePort = process.env.PORT || this.config.hydra.servicePort;
    }

    async init(hydra) {
        this.hydra = hydra || require('hydra');

        let type = this.config.hydra.serviceType || 'native';
        if (FrameworkStrategies[type])
            this.strategy = FrameworkStrategies[type](this);
        else
            this.strategy = require('hydra-integration-' + type)(this);

        if (!hydra) {
            await this.hydra.init(this.config);
            this.emit('hydra:initialized', this.config.hydra);
            let info = await this.hydra.registerService();
            this.emit('hydra:registered', info);
        }

        return this;
    }

    shutdown() {
        this.emit('hydra:beforeShutdown', this.getHydra());
        this.hydra.shutdown();
        this.emit('hydra:afterShutdown', this.getHydra());
    }

    getHydra() {
        return this.hydra;
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


class HydraIntegrationPlugin extends HydraPlugin {
    constructor() {
        super('hydra-plugin-integration');
    }

    setHydra(hydra) {
        super.setHydra(hydra);
    }

    setConfig(hConfig) {
        super.setConfig(hConfig);
        this.config = {
            hydra: hConfig
        };
        this.configChanged(this.opts);
    }

    configChanged(opts = {}) {
        this.config = Object.assign(this.config, opts);
    }
    async onServiceReady() {
        this.factory = new HydraServiceFactory(this.config);
        this.hydra.integration = this.factory;

        await this.factory.init(this.hydra);
    }
}

module.exports = {
    HydraServiceFactory,
    FrameworkStrategies,
    HydraIntegrationPlugin
}