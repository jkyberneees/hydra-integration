const HydraServiceFactory = require('./index').HydraServiceFactory;
const expect = require("chai").expect;
const request = require('supertest');

describe('Hydra Service Factory', () => {
    it('Building hydra service + express', async() => {
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

        // initialize the factory
        let info = await factory.init();
        // build express service
        let service = await factory.getService({
            bootstrap: async(service, factory) => {
                let router = require('express').Router();
                router.get('/welcome', (req, res) => res.send('Hello World!'));

                service.use('/v1', router);
            }
        });

        // test express service API directly
        await request(service).get('/_health').expect(200);
        await request(service).get('/v1/welcome').then(response => expect(response.text).to.equal('Hello World!'));

        // test express service API directly through hydra
        let hydra = factory.getHydra();
        let message = hydra.createUMFMessage({
            to: 'express-service-test:[GET]/v1/welcome',
            from: 'website:backend',
            body: {}
        });
        await hydra.makeAPIRequest(message).then(response => expect(response.body).to.equal('Hello World!'));

        // finally shutdown all including express server
        return factory.shutdown();
    });

    it('Building hydra service + hapi', async() => {
        const factory = new HydraServiceFactory({
            hydra: {
                'serviceName': 'hapi-service-test',
                'serviceDescription': 'Basic hapi service on top of Hydra',
                'serviceIP': '127.0.0.1',
                'servicePort': 3000,
                'serviceType': 'hapi',
                'serviceVersion': '1.0.0',
                'redis': {
                    'url': '127.0.0.1',
                    'port': 6379,
                    'db': 15
                }
            }
        });

        // initialize the factory
        let info = await factory.init();
        // build express service
        let service = await factory.getService({
            bootstrap: async(service, factory) => {
                service.route({
                    method: 'GET',
                    path: '/v1/welcome',
                    handler: (request, reply) => {
                        reply('Hello World!');
                    }
                });
            }
        });

        // test express service API directly
        await request(service.listener).get('/_health').expect(200);
        await request(service.listener).get('/v1/welcome').then(response => expect(response.text).to.equal('Hello World!'));

        // test express service API directly through hydra
        let hydra = factory.getHydra();
        let message = hydra.createUMFMessage({
            to: 'hapi-service-test:[GET]/v1/welcome',
            from: 'website:backend',
            body: {}
        });
        await hydra.makeAPIRequest(message).then(response => expect(response.body).to.equal('Hello World!'));

        // finally shutdown all including hapi server
        return factory.shutdown();
    });
});