# Hapi Integration #
Integrate hapi framework with hydra.
> Hydra serviceType: hapi

## NPM dependencies
```bash
npm i hapi --save
```

## Configuration example ##
```js
const factory = new HydraServiceFactory({
    hapi: {
        // optional hapi config here... (except connections)
    }
    hydra: {
        'serviceName': 'hapi-service-test',
        'serviceDescription': 'Basic hapi service on top of Hydra',
        'serviceIP': '127.0.0.1',
        'servicePort': 3000,
        'serviceType': 'hapi',
        'serviceVersion': '1.0.0',
        'redis': {
            'host': '127.0.0.1',
            'port': 6379,
            'db': 15
        }
    }
});
```

## Usage
```js
const HydraServiceFactory = require('hydra-integration').HydraServiceFactory;
const factory = new HydraServiceFactory(config);

factory.init().then(factory => factory.getService({
    hapi: {}, // optionally override hapi config
    bootstrap: async(service, factory) => {
        service.route({
            method: 'GET',
            path: '/v1/welcome',
            handler: (request, reply) => reply('Hello World!')
        });
    }
}));
```