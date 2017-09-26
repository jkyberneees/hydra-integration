/* eslint import/no-extraneous-dependencies:0, no-unused-vars:0, no-console:0 */
const express = require('express');

const server = express();
const router = express.Router();

router.post('/sendemail', (req, res) => res.send('Email was successfully send!'));
server.use('/v1', router);

// registering health endpoint
server.get('/_health', (req, res) => res.send('OK'));

const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
const PORT = process.env.PORT || 3000;
server.listen(PORT, HOSTNAME);

// integrating hydra
const HydraServiceFactory = require('./../../index').HydraServiceFactory;

const factory = new HydraServiceFactory({
  hydra: {
    serviceName: 'email-service',
    serviceDescription: 'Basic express service on top of Hydra',
    serviceIP: HOSTNAME,
    servicePort: PORT,
    serviceType: 'express',
    serviceVersion: '1.0.0',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 15
    }
  }
});

// sync express
factory
  .init()
  .then(async () => {
    const hydra = await factory.sync(server);
  })
  .catch(console.error);
