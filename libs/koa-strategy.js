/**
 * Hydra Integration Strategy for Koa Framework 
 * (http://koajs.com/)
 */
module.exports = (factory, config) => {
    const hydra = factory.getHydra();

    return new Promise(async(resolve, reject) => {
        try {
            const Koa = require('koa');
            const service = new Koa();
            const router = require('koa-router')();

            router.get('/_health', async(ctx) => {
                ctx.status = 200;
            });
            service.use(router.routes());

            if (config.bootstrap) {
                await config.bootstrap(service, factory);
            }

            // registering hydra routes
            await hydra.registerRoutes(service.middleware.reduce((arr, m) => {
                if (m.router && m.router.stack) {
                    m.router.stack.forEach(route => {
                        route.methods.forEach(method => arr.push(`[${method.toUpperCase()}]${route.path}`));
                    });
                }

                return arr;
            }, []));

            // starting koa server
            let server = service.listen(
                config.hydra.servicePort,
                (config.server.bindToServiceIp) ? config.hydra.serviceIP : null,
                (err) => err ? reject(err) : resolve(service));

            // registering server.close callback 
            factory.on('hydra:beforeShutdown', () => server.close());
        } catch (err) {
            reject(err);
        }
    });
}