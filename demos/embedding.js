/* eslint import/no-extraneous-dependencies:0, no-unused-vars:0 */

// classic express service
const express = require('express');

const server = express();
const router = express.Router();

router.get('/welcome', (req, res) => res.send('Hello World!'));
server.use('/v1', router);

const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
const PORT = process.env.PORT || 3000;
const http = server.listen(PORT, HOSTNAME);

// integrating hydra
const HydraServiceFactory = require('./../index').HydraServiceFactory;

const factory = new HydraServiceFactory({
  hydra: {
    serviceName: 'express-service-test',
    serviceDescription: 'Basic express service on top of Hydra',
    serviceIP: HOSTNAME,
    servicePort: PORT,
    serviceType: 'express',
    serviceVersion: '1.0.0',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 15,
    },
  },
});

// sync express
factory.init().then(async () => {
  const hydra = await factory.sync(server);
});
