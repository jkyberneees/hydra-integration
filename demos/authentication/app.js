/* eslint import/no-extraneous-dependencies:0, no-unused-vars:0, no-console:0 */
const Koa = require('koa');

const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
const PORT = process.env.PORT || 3002;

const service = new Koa();
const router = require('koa-router')();

router.post('/v1/login', async (ctx) => {
  ctx.body = 'Login successfully!';
  ctx.status = 200;
});
router.post('/v1/logout', async (ctx) => {
  ctx.body = 'Logout successfully!';
  ctx.status = 200;
});
router.get('/_health', async (ctx) => {
  ctx.status = 200;
});

service.use(router.routes());

// starting koa server
const server = service.listen(PORT, HOSTNAME);

// integrating hydra
const HydraServiceFactory = require('./../../index').HydraServiceFactory;

const factory = new HydraServiceFactory({
  hydra: {
    serviceName: 'auth-service',
    serviceDescription: 'Basic koa service on top of Hydra',
    serviceIP: HOSTNAME,
    servicePort: PORT,
    serviceType: 'koa',
    serviceVersion: '1.0.0',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 15,
    },
  },
});

// sync express
factory
  .init()
  .then(async () => {
    const hydra = await factory.sync(service);
  })
  .catch(console.error);
