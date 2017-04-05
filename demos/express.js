const HydraServiceFactory = require('./../index').HydraServiceFactory;
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