const HydraIntegration = require('./index').HydraIntegration;
const expect = require("chai").expect;

describe('Hydra Integration', () => {
    it('Building express WebServer + Hydra', async() => {
        const factory = new HydraIntegration({
            hydra: {
                'serviceName': 'express-service-test',
                'serviceDescription': 'Basic express service',
                'serviceIP': '127.0.0.1',
                'servicePort': 3000,
                'serviceType': 'test',
                'serviceVersion': '1.0.0',
                'redis': {
                    'url': '127.0.0.1',
                    'port': 6379,
                    'db': 15
                }
            }
        });

        let info = await factory.init();
        let app = await factory.buildWebServer('express', {
            bootstrap: (app) => {
                app.get('/welcome', (req, res) => {
                    res.send('Hello World!');
                });
            }
        });

        return factory.shutdown();
    });
});