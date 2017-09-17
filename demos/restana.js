const HydraServiceFactory = require('./../index').HydraServiceFactory;

const factory = new HydraServiceFactory({
  hydra: {
    serviceName: 'restana-service-test',
    serviceDescription: 'Basic restana service on top of Hydra',
    serviceIP: '127.0.0.1',
    servicePort: 3000,
    serviceType: 'restana',
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
    service.get('/v1/welcome', (req, res) => {
      res.send('Hello World!');
    });
  }),
);
