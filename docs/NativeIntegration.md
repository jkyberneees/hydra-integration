# Native Integration
Just create a [low level hydra](https://github.com/flywheelsports/hydra/tree/master/tests/messaging) service.
> Hydra serviceType: native

## Configuration example
```js
const factory = new HydraServiceFactory({
    hydra: {
        'serviceName': 'native-service-test',
        'serviceDescription': 'Basic native service on top of Hydra',
        'serviceIP': '127.0.0.1',
        'servicePort': 3000,
        'serviceType': 'native',
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

let service = await factory.getService({
    bootstrap: async(hydra, factory) => {
        console.log(hydra.getServiceName());
    }
});
```
