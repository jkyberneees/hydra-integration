const HydraServiceFactory = require('./../index').HydraServiceFactory;
const factory = new HydraServiceFactory({
    hydra: {
        'serviceName': 'hapi-service-test',
        'serviceDescription': 'Basic hapi service on top of Hydra',
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

factory.on('hydra:registered', async() => {
    let service = await factory.getService({
        hapi: {},
        bootstrap: async(service, factory) => {
            service.route({
                method: 'GET',
                path: '/v1/welcome',
                handler: (request, reply) => reply('Hello World!')
            });
        }
    });
});

factory.init();