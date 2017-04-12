# Hapi Integration #
Integrate hapi framework with hydra.
> Hydra serviceType: hapi

## Configuration example ##
```js
const factory = new HydraServiceFactory({
    hapi: {
        // optional hapi config here... (except connections)
    }
    hydra: {
        'serviceName': 'express-service-test',
        'serviceDescription': 'Basic express service on top of Hydra',
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