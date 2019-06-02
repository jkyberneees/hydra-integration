/* eslint import/no-extraneous-dependencies:0, no-unused-vars:0 */

const HydraServiceFactory = require('./../index').HydraServiceFactory
const express = require('express')

const router = express.Router()

const factory = new HydraServiceFactory({
  hydra: {
    serviceName: 'express-service-test',
    serviceDescription: 'Basic express service on top of Hydra',
    serviceIP: '127.0.0.1',
    servicePort: 3000,
    serviceType: 'express',
    serviceVersion: '1.0.0',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 15
    }
  }
})

factory.init().then(() =>
  factory.getService((service) => {
    router.get('/welcome', (req, res) => res.send('Hello World!'))
    service.use('/v1', router)
  })
)
