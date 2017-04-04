'use strict';

const hydra = require('hydra');
const EventEmitter = require('eventemitter2').EventEmitter2;

const HTTP_OK = 200;
const HYDRA_EVENT_SUFIX = 'hydra:';

function getEventName(postfix) {
    return HYDRA_EVENT_SUFIX + postfix;
}

let serviceStrategies = {
    express: (factory, config) => {
        return new Promise(async(resolve, reject) => {
            let service = require('express')();
            service.get('/_health', (req, res) => res.sendStatus(HTTP_OK));

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
            factory.on(getEventName('beforeShutdown'), () => server.close());
        });
    },
    hapi: (factory, config) => {
        return new Promise(async(resolve, reject) => {
            const Hapi = require('hapi');
            const service = new Hapi.Server(config.hapi || {});
            service.connection({
                port: config.hydra.servicePort,
                host: config.hydra.serviceIP
            });

            service.route({
                method: 'GET',
                path: '/_health',
                handler: (request, reply) => reply()
            });

            if (config.bootstrap) {
                await config.bootstrap(service, factory);
            }

            // registering hydra routes
            await hydra.registerRoutes(service.table()[0].table.reduce((arr, route) => {
                arr.push(`[${route.method.toUpperCase()}]${route.path}`);
                return arr;
            }, []));

            // starting express server
            service.start(err => err ? reject(err) : resolve(service));

            // registering server.close callback 
            factory.on(getEventName('beforeShutdown'), () => service.stop());
        });
    }
};

class HydraServiceFactory extends EventEmitter {
    constructor(config = {}) {
        super({
            wildcard: true,
            newListener: true
        });

        this.config = config;
    }

    async init() {
        await hydra.init(this.config);
        this.emit(getEventName('initialized'), this.config);

        let info = await hydra.registerService();
        this.emit(getEventName('registered'), info);

        return info;
    }

    shutdown() {
        this.emit(getEventName('beforeShutdown'), this);
        hydra.shutdown();
        this.emit(getEventName('afterShutdown'), this);
    }

    getHydra() {
        return hydra;
    }

    async getService(config = {}) {
        if (!this.service) {
            let type = this.config.hydra.serviceType;
            if (serviceStrategies[type])
                this.service = await serviceStrategies[type](this, Object.assign(config, this.config));
            else throw new Error(`Unsupported service-type: '${type}'`);
        }

        return this.service;
    }
}


module.exports = {
    HydraServiceFactory,
    serviceStrategies
}