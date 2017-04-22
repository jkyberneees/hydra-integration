# The HydraIntegrationPlugin class 
The class allow developers to use the hydra-integration module as an [hydra plugin](https://github.com/flywheelsports/hydra/blob/master/plugins.md).

When used as a plugin, the factory is attached to the hydra object:
```js
hydra.integration instanceof HydraServiceFactory === true;
```

## Usage example
```js
const HydraIntegrationPlugin = require('hydra-integration').HydraIntegrationPlugin;
const express = require('express');
const router = express.Router();

let hydra = require('hydra');
hydra.use(new HydraIntegrationPlugin());

hydra.init({
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
}).then(() => {
    return hydra.registerService();
}).then(async() => {
    let service = await hydra.integration.getService(service => {
        router.get('/welcome', (req, res) => res.send('Hello World!'));
        service.use('/v1', router);
    });
});
```

