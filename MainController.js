const
    coffeeService = require('./coffeeService'),
    async = require('async');


class MainController {

    main(req, res) {
        res.json({ text: 'Hello' });
    }

    asyncVersion(req, res) {
        coffeeService.start();

        async.auto({
            getWater: (callback) => {
                coffeeService.get('water')
                    .then((data) => callback(null, data));
            },
            getMilk: (callback) => {
                coffeeService.get('milk')
                    .then((data) => callback(null, data));
            },
            boilMilk: ['getMilk', (result, callback) => {
                coffeeService.get('milkBoiled')
                    .then((data) => callback(null, data));
            }],

            getCoffee: (callback) => {
                coffeeService.get('coffee')
                    .then((data) => callback(null, data));
            },
            grindCoffee: ['getCoffee', (result, callback) => {
                coffeeService.get('coffeeGrinded')
                    .then((data) => callback(null, data));
            }],
            frameMug: (callback) => {
                coffeeService.get('mugFramed')
                    .then((data) => callback(null, data));
            },
            makeCoffee: ['getWater', 'frameMug', 'grindCoffee', 'boilMilk', (result, callback) => {
                coffeeService.get('coffeeReadyToGo')
                    .then((data) => callback(null, data));
            }]
        }, (err, result) => {
            res.json({ time: coffeeService.finish(result) });
        });

    }

    nativePromiseVersion(req, res) {
        res.json({ nothing: true });
    }

    asyncAwaitVersion(req, res) {
        res.json({ nothing: true });
    }

    rxJSVersion(req, res) {
        res.json({ nothing: true });
    }

}

module.exports = new MainController();
