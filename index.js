'use strict';

const hydra = require('hydra');
const EventEmitter = require('eventemitter2').EventEmitter2;

const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const HTTP_SERVER_ERROR = 500;
const HYDRA_EVENT_SUFIX = 'hydra:';

function getEventName(postfix) {
    return HYDRA_EVENT_SUFIX + postfix;
}

let WebServerStrategies = {
    express: (factory, config) => {
        return new Promise(async(resolve, reject) => {
            let app = require('express')();
            app.get('/_health', (req, res) => {
                res.send('OK');
            });

            if (config.bootstrap) {
                await config.bootstrap(app);
            }

            // registering hydra routes
            let routes = app._router.stack.filter(stack => stack.route).map(r => r.route);
            let hydraRoutes = [];
            for (let route of routes) {
                for (let method in route.methods) {
                    hydraRoutes.push(`[${method.toUpperCase()}]${route.path}`);
                }
            }
            await hydra.registerRoutes(hydraRoutes);

            // starting express server
            let server = app.listen(config.hydra.servicePort, config.hydra.serviceIP, function (err) {
                if (err) reject(err);
                resolve(app);
            });

            // registering server.close callback 
            factory.on(getEventName('beforeShutdown'), () => {
                server.close();
            });
        });
    }
};

class HydraIntegration extends EventEmitter {
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

    async buildWebServer(type = 'express', config = {}) {
        if (WebServerStrategies[type])
            return await WebServerStrategies[type](this, Object.assign(config, this.config));

        throw new Error(`Unsupported strategy: '${type}'`);
    }
}


module.exports = {
    HydraIntegration,
    WebServerStrategies
}