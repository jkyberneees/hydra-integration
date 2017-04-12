# Native Integration
Just create a low level hydra service.
> Hydra serviceType: native

## Configuration example
```js
const factory = new HydraServiceFactory({
    hydra: {
        'serviceName': 'express-service-test',
        'serviceDescription': 'Basic express service on top of Hydra',
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

## Example usage 
```js
// ...

let service = await factory.getService({
    bootstrap: async(hydra, factory) => {
        console.log(hydra.getServiceName());
    }
});
```