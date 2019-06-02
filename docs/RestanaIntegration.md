# Restana Integration #
Integrate [Restana framework](https://github.com/jkyberneees/ana) with hydra.
> Hydra serviceType: restana

## NPM dependencies
```bash
npm i restana --save
```

## Configuration example ##
```js
const factory = new HydraServiceFactory({
    restana: {
        // optionally pass restana configuration here
        // https://www.npmjs.com/package/restana#configuration
    },
    hydra: {
        'serviceName': 'restana-service-test',
        'serviceDescription': 'Basic restana service on top of Hydra',
        'serviceIP': '127.0.0.1',
        'servicePort': 3000,
        'serviceType': 'restana',
        'serviceVersion': '1.0.0',
        'redis': {
            'host': '127.0.0.1',
            'port': 6379,
            'db': 15
        }
    }
});
```

## Usage
```js
const HydraServiceFactory = require('hydra-integration').HydraServiceFactory;
const factory = new HydraServiceFactory(config);

factory.init().then(factory => factory.getService(service => {
    service.get('/v1/welcome', (req, res) => {
        res.send('Hello World!');
    });
}));
```