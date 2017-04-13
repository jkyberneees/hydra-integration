# Sails (0.x) Integration
Integrate Sails(v0.x) framework with hydra.
> Hydra serviceType: sails0

## Configuration example
```js
const factory = new HydraServiceFactory({
    hydra: {
        'serviceName': 'sails-service-test',
        'serviceDescription': 'Sails + Hydra embedding example',
        'serviceIP': sails.config.explicitHost || process.env.HOSTNAME || '127.0.0.1',
        'servicePort': process.env.PORT || 1337,
        'serviceType': 'sails0',
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

// sync sails
factory.init().then(async() => {
    let hydra = await factory.sync(sails);
});
```
