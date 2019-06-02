/* eslint import/no-extraneous-dependencies:0, no-unused-vars:0, no-console:0 */

const HydraIntegrationPlugin = require('./../index').HydraIntegrationPlugin
const express = require('express')

const router = express.Router()

const hydra = require('hydra')

hydra.use(new HydraIntegrationPlugin())

hydra
  .init({
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
  .then(() => hydra.registerService())
  .then(async () => {
    const service = await hydra.integration.getService(() => {
      router.get('/welcome', (req, res) => res.send('Hello World!'))
      service.use('/v1', router)
    })
  })
  .catch(console.log)
