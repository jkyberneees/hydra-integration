# The HydraServiceFactory class #
The 'factory' class act as a service assambler, being responsible for the proper instantiation of the low level hydra service and the target framework strategy *"the service"*.
Convenient events are triggered so developers can have full control of the process.

## Config params ##
The concrete configuration parameters may vary from custom web framework strategy, however the following are generic:
```js
server : { 
    // indicate if the HTTP server require to bind the service IP, default value: FALSE
    bindToServiceIP: false
}
// the hydra configuration https://www.hydramicroservice.com/docs/hydra-core/getting-started.html
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
```

## Object events ##
```js
//...

factory.on('hydra:initialized', config => {
    // the hydra service has been initialized
});

factory.on('hydra:registered', info => {
    // the hydra service has been registered
});

factory.on('hydra:beforeShutdown', hydra => {
    // before shutdown the hydra service 
});

factory.on('hydra:afterShutdown', hydra => {
    // after shutdown the hydra service 
});

factory.init(); // initialize the factory to start the hydra service connection
```

## Usage ##
```js
const HydraServiceFactory = require('hydra-integration').HydraServiceFactory;

// create instance (here we define express as web framework, see: serviceType)
let factory = new HydraServiceFactory({
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

// initialize the factory
await factory.init();

// optionally you can get the ready to use hydra instance reference
let hydra = factory.getHydra();

// build the web framework high level service
await factory.getService(s => {
        // here your express instance
        // add your routes ...
        s.get('/welcome', (req, res) => res.send('Hello World!'));
});

// optionally you can build the web framework high level service passing a config object
await factory.getService({
    // can override/add any config params here ...
    bootstrap: async(s, factory) => {
        // here your express instance
        // add your routes ...
        s.get('/welcome', (req, res) => res.send('Hello World!'));
    }
});

// finally shutdown the factory, it automatically shutdown the web server
factory.shutdown();
```

## Embedding ##
In case your application is already creating your web framework instance somewhere else, you still can integrate hydra.
The 'factory' can synchronize the hydra service with an existing web framework instance by calling the method *"sync"*:

Example using express:
```js
// classic express service
const express = require('express');
const server = express();
const router = express.Router();

router.get('/welcome', (req, res) => res.send('Hello World!'));
server.use('/v1', router);

let HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
let PORT = process.env.PORT || 3000;
let http = server.listen(PORT, HOSTNAME);

// hydra integration
const HydraServiceFactory = require('./../index').HydraServiceFactory;
const factory = new HydraServiceFactory({
    hydra: {
        'serviceName': 'express-service-test',
        'serviceDescription': 'Basic express service on top of Hydra',
        'serviceIP': HOSTNAME,
        'servicePort': PORT,
        'serviceType': 'express',
        'serviceVersion': '1.0.0',
        'redis': {
            'host': '127.0.0.1',
            'port': 6379,
            'db': 15
        }
    }
});

// sync express
factory.init().then(async() => {
    let hydra = await factory.sync(server);
});
```
