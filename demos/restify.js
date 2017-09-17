const HydraServiceFactory = require('./../index').HydraServiceFactory;

const factory = new HydraServiceFactory({
  hydra: {
    serviceName: 'restify-service-test',
    serviceDescription: 'Basic restify service on top of Hydra',
    serviceIP: '127.0.0.1',
    servicePort: 3000,
    serviceType: 'restify',
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
    service.get('/v1/welcome', (req, res, next) => {
      res.send(200, 'Hello World!');
      return next();
    });
  }),
);
