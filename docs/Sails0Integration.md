# Sails (0.x) Integration
Integrate [Sails(v0.x) framework](http://sailsjs.com/) with hydra.
> Hydra serviceType: sails0

## NPM dependencies
Hydra integration with Sails Framework only work by using the embedding method: sync, then you only need to install hydra-integration in your existing sails app:
```bash
npm i hydra-integration --save
```

## Configuration example
```js
const factory = new HydraServiceFactory({
    hydra: {
        'serviceName': 'sails-service-test',
        'serviceDescription': 'Sails + Hydra embedding example',
        'serviceIP': sails.config.explicitHost || process.env.HOSTNAME || '127.0.0.1',
        'servicePort': sails.config.port,
        'serviceType': 'sails0',
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

// sync sails
factory.init().then(async() => {
    let hydra = await factory.sync(sails);
});
```
