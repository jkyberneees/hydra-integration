/* eslint import/no-extraneous-dependencies:0, no-return-assign:0 */

const HydraServiceFactory = require('./../index').HydraServiceFactory;
const router = require('koa-router')();

const factory = new HydraServiceFactory({
  hydra: {
    serviceName: 'koa-service-test',
    serviceDescription: 'Basic koa service on top of Hydra',
    serviceIP: '127.0.0.1',
    servicePort: 3000,
    serviceType: 'koa',
    serviceVersion: '1.0.0',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 15
    }
  }
});

factory.init().then(() =>
  factory.getService((service) => {
    router.get('/v1/welcome', async ctx => (ctx.body = 'Hello World!'));
    service.use(router.routes());
  })
);
