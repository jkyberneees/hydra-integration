# Implementing a custom REST framework integration
Integrating a third-party REST framework with hydra is very straightforward.
In order to be compatible with the  hydra-integration module, custom integrations require to provide the following strategies:
* How to instantiate the target REST framewotk service?
* How to list all exposed HTTP routes using the hydra address format? Example: [GET]/pets, [PUT]/pets/:id
* How to listen to system events through the hydra message bus (if apply)? 

## Integration interface
```js
/**
 * Hydra Integration Strategy for X framework
 * (https://www.X.com/)
 */
'use strict';
module.exports = (factory) => {

    return {
        build: (config) => {
            /**
            * How the service is instantiated?
            * Require hydra events registration at this point?
            */
            return Promise.reject('Unsupported operation!');
        },
        sync: async(service, config) => {
            /**
            * How to populate exposed REST routes?
            * Require hydra events registration at this point?
            */
            return Promise.reject('Unsupported operation!');
        }
    }
}
```

## Integrating a custom REST framework
To demonstrate how easy can be to implement the required strategies, let's pick one of the tiny REST frameworks available at npm:
* [restana](https://www.npmjs.com/package/restana): Super fast and minimalist web framework for building REST micro-services.

The 'restana' framework interface is very simple:
```js
const service = require('restana')({});
service.get('/hello/:name', (req, res) => {
    res.send('Hello: ' + req.params.name);
});
service.start();
```
Getting the routes:
```js
service.routes();
// => ['[GET]/v1/welcome']
```

### Concrete implementation example:
```js
/**
 * Hydra Integration Strategy for restana framework
 * (https://github.com/jkyberneees/ana)
 */
'use strict';
module.exports = (factory) => {

    return {
        build: (config) => {
            return new Promise(async(resolve, reject) => {
                try {
                    let service = require('restana')(config.restana || {});
                    service.get('/_health', (req, res) => res.send(200));

                    if (config.bootstrap) {
                        await config.bootstrap(service, factory);
                    }

                    service.start(config.hydra.servicePort,
                        (config.server.bindToServiceIP) ? config.hydra.serviceIP : null).then(() => resolve(service)).catch(reject);

                    factory.on('hydra:beforeShutdown', () => service.close());
                } catch (err) {
                    reject(err);
                }
            });
        },
        sync: async(service, config) => {
            const hydra = factory.getHydra();
            await hydra.registerRoutes(service.routes());

            return hydra;
        }
    }
}
```

## Registering the new strategy
To make the new strategy available for the hydra-integration module, we have two posibilities:
* Before init the factory:
```js
let FrameworkStrategies = require('hydra-integration').FrameworkStrategies;
FrameworkStrategies['restana'] = require('./strategy');

// ...
await factory.init()
```
* By publishing a module to NPM with the following name schema:
```bash
hydra-integration-{strategy}
```
> In the current example that would be: hydra-integration-restana

## Usage example
```js
const HydraServiceFactory = require('hydra-integration').HydraServiceFactory;
const factory = new HydraServiceFactory({
    hydra: {
        'serviceName': 'restana-service-test',
        'serviceDescription': 'Basic restana service on top of Hydra',
        'serviceIP': '127.0.0.1',
        'servicePort': 3000,
        'serviceType': 'restana',
        'serviceVersion': '1.0.0',
        'redis': {
            'host': '127.0.0.1',
            'port': 6379,
            'db': 15
        }
    }
});

factory.init().then(factory => factory.getService(service => {
    service.get('/v1/welcome', (req, res) => {
        res.send('Hello World!');
    });
}));
```
> The restana framework integration is supported on the hydra-integration module. It is intended for testing or educational purposes. 