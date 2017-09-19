/* eslint import/no-extraneous-dependencies:0, no-unused-vars:0, no-restricted-syntax:0,
global-require: 0 */

const HydraServiceFactory = require('./../../index').HydraServiceFactory;
const express = require('express');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const notes = require('./controller');

const router = express.Router();

const factory = new HydraServiceFactory(require('./config'));

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
