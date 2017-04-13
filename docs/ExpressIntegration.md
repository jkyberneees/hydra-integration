# Express Integration #
Integrate express framework with hydra.
> Hydra serviceType: express

## Configuration example ##
```js
const factory = new HydraServiceFactory({
    hydra: {
        'serviceName': 'express-service-test',
        'serviceDescription': 'Basic express service on top of Hydra',
        'serviceIP': '127.0.0.1',
        'servicePort': 3000,
        'serviceType': 'express',
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
const express = require('express');
const router = express.Router();

factory.init().then(factory => factory.getService(service => {
    router.get('/welcome', (req, res) => res.send('Hello World!'));
    service.use('/v1', router);
}));
```