// classic express service
const express = require('express');
const server = express();
const router = express.Router();

router.get('/welcome', (req, res) => res.send('Hello World!'));
server.use('/v1', router);

let HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
let PORT = process.env.PORT || 3000;
let http = server.listen(PORT, HOSTNAME);

// integrating hydra
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