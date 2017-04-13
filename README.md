# Hydra Integration Module
Integrating third-party Node.js web frameworks with Hydra, the simplest way.

> Hydra is a NodeJS package, which facilitates building distributed applications such as Microservices. 
> (https://www.hydramicroservice.com/)

The magic thing with Hydra is that with a minimum setup, your micro-service get 'superpowers':
- Distributed Computing
- Application Clusters + Load Balancer
- High Availability
- Centralized Proxy Router
- Realtime Messaging
- Service Discovery, Monitoring and Management
- ... and much more (https://www.hydramicroservice.com/)

By using this module, you will be able to easily integrate your prefered web framework with hydra. Just keep reading...

## Integrated frameworks
At the moment, the following frameworks are supported:
1. **Express**: Fast, unopinionated, minimalist web framework for Node.js... (http://expressjs.com/)
2. **Hapi**: A rich framework for building applications and services, hapi enables developers to focus on writing reusable application logic instead of spending time building infrastructure... (https://hapijs.com/)
3. **Koa**: Koa is a new web framework designed by the team behind Express, which aims to be a smaller, more expressive, and more robust foundation for web applications and APIs... (http://koajs.com/)
4. **Sails.js**: Sails makes it easy to build custom, enterprise-grade Node.js apps.... (http://sailsjs.com/)
5. **Native Hydra Service**: Hydra services are ideal for making distributed API calls through HTTP or real-time events management... (https://www.hydramicroservice.com/)

## Getting Started
Next we will explain you how to create and express based micro-service on top of hydra:
> IMPORTANT: Hydra depends on Redis database server for storage, cache and messaging. In case you don't have it yet: https://www.hydramicroservice.com/docs/quick-start/step1.html

1. Install dependencies:
```bash
npm i hydra-integration express --save
```

2. Create and edit app.js file:
```js
const HydraServiceFactory = require('hydra-integration').HydraServiceFactory;
const express = require('express');
const router = express.Router();

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

factory.init().then(factory => factory.getService(service => {
    router.get('/welcome', (req, res) => res.send('Hello World!'));
    service.use('/v1', router);
}));
```
3. Run your service: 
- Single process:
```bash
node app.js
```
- Optionally you can run multiple processes with [PM2](http://pm2.keymetrics.io/docs/usage/cluster-mode/):
```bash
pm2 start app.js -i 4
```
4. Test your service using a Web browser at: http://localhost:3000/v1/welcome
5. Test the service using the hydra-cli (https://www.hydramicroservice.com/docs/tools/hydra-cli/getting-started.html):  
- List service routes 
```bash
hydra-cli routes express-service-test
```
```json
{
  "serviceName": [
    "[GET]/_health",
    "[GET]/v1/welcome"
  ]
}
```
- Invoke the [GET]/v1/welcome service endpoint: 
```bash
hydra-cli rest express-service-test:[GET]/v1/welcome
```
```json
{
  "headers": {
    "x-powered-by": "Express",
    "content-type": "text/html; charset=utf-8",
    "content-length": "12",
    "etag": "W/\"c-Lve95gjOVATpfV8EL5X4nxwjKHE\"",
    "date": "Wed, 05 Apr 2017 21:22:51 GMT",
    "connection": "close"
  },
  "body": "Hello World!",
  "statusCode": 200
}
```

## Demos
Demos available into [demos folder](demos) on the git repository: https://github.com/jkyberneees/hydra-integration

## Next Topics 
- [The HydraServiceFactory class](docs/HydraServiceFactory.md)
- [Express Framework Integration](docs/ExpressIntegration.md)
- [Hapi Framework Integration](docs/HapiIntegration.md)
- [Koa Framework Integration](docs/KoaIntegration.md)
- [Sails(0.x) Framework Integration](docs/Sails0Integration.md)
- [Native Hydra Integration](docs/NativeIntegration.md)
- [Creating your own integration](docs/CustomIntegration.md)
- [Reference documentation](https://www.hydramicroservice.com/)

## Complementary Topics
- [The Hydra Router](https://github.com/flywheelsports/hydra-router/blob/master/README.md)