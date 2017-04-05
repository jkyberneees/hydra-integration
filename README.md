# Hydra Integration Module
Integrating third-party Node.js web frameworks with Hydra, the simplest way.

> Hydra is an NodeJS package, which facilitates building distributed applications such as Microservices. 
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
On the first release the following frameworks are already supported:
1. **Express**: Fast, unopinionated, minimalist web framework for Node.js... (http://expressjs.com/)
2. **Hapi**: A rich framework for building applications and services, hapi enables developers to focus on writing reusable application logic instead of spending time building infrastructure... (https://hapijs.com/)
3. **Koa**: Koa is a new web framework designed by the team behind Express, which aims to be a smaller, more expressive, and more robust foundation for web applications and APIs... (http://koajs.com/)
4. **Native Hydra Service**: Hydra services are ideal for making distributed API calls through HTTP or real-time events management... (https://www.hydramicroservice.com/)

## API Usage
Creating an express micro-service on top of hydra:

1. Install dependencies:
```bash
npm i hydra-integration express --save
```

2. Create and edit app.js file:
```js
const HydraServiceFactory = require('hydra-integration').HydraServiceFactory;
const factory = new HydraServiceFactory({
    hydra: {
        'serviceName': 'express-service-test',
        'serviceDescription': 'Basic express service on top of Hydra',
        'serviceIP': '127.0.0.1',
        'servicePort': 3000,
        'serviceType': 'express',
        'serviceVersion': '1.0.0',
        'redis': {
            'url': '127.0.0.1',
            'port': 6379,
            'db': 15
        }
    }
});

factory.on('hydra:registered', async() => {
    let service = await factory.getService({
        bootstrap: async(service, factory) => {
            let router = require('express').Router();
            router.get('/welcome', (req, res) => res.send('Hello World!'));

            service.use('/v1', router);
        }
    });
});

factory.init();
```
3. Run your service: 
```js (node version >=7.x)
node app.js
```
4. Test your service using a Web browser at: http://localhost:3000/v1/welcome
5. Test the service using the hydra-cli (https://www.hydramicroservice.com/docs/tools/hydra-cli/getting-started.html):
```bash

```