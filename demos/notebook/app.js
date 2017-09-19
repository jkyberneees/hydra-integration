/* eslint import/no-extraneous-dependencies:0, no-unused-vars:0, no-restricted-syntax:0 */
const HydraServiceFactory = require('./../../index').HydraServiceFactory;
const express = require('express');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const notes = require('./controller');

const router = express.Router();

const factory = new HydraServiceFactory({
  hydra: {
    serviceName: 'notebook-service',
    serviceDescription: 'Basic express service on top of Hydra',
    serviceIP: '127.0.0.1',
    servicePort: 0, // if value is 0, the port is assigned automatically
    serviceType: 'express',
    serviceVersion: '1.0.0',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 15,
    },
  },
});

factory.init().then(() =>
  factory.getService((service) => {
    service.use(bodyParser.json());
    service.use(bodyParser.urlencoded({ extended: true }));

    router.get('/notes', notes.list);
    router.get('/notes/:id', notes.get);
    router.put('/notes/:id', notes.update);
    router.delete('/notes/:id', notes.delete);
    router.post('/notes', notes.create);

    service.use('/v1', router);
  }),
);
