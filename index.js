'use strict';

const hydra = require('hydra');
const EventEmitter = require('eventemitter2').EventEmitter2;

const FrameworkStrategies = {
    native: require('./libs/native-strategy'),
    koa: require('./libs/koa-strategy'),
    express: require('./libs/express-strategy'),
    hapi: require('./libs/hapi-strategy')
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
        this.emit('hydra:initialized', this.config);

        let info = await hydra.registerService();
        this.emit('hydra:registered', info);

        return this;
    }

    shutdown() {
        this.emit('hydra:beforeShutdown', this);
        hydra.shutdown();
        this.emit('hydra:afterShutdown', this);
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
            let type = this.config.hydra.serviceType || 'native';
            if (FrameworkStrategies[type])
                this.service = await FrameworkStrategies[type](this, config);
            else
                this.service = await require('hydra-integration-' + type)(this, config);
        }

        return this.service;
    }
}


module.exports = {
    HydraServiceFactory,
    FrameworkStrategies
}