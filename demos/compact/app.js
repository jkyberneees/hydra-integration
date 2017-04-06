const HydraServiceFactory = require('./../../index').HydraServiceFactory;
const router = require('koa-router')();
const config = require('./config');

new HydraServiceFactory(config)
    .init()
    .then(factory => factory.getService(service => {
        router.get('/v1/welcome', async(ctx) => ctx.body = 'Hello World!');
        service.use(router.routes());
    }));