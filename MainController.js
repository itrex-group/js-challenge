const
    coffeeService = require('./coffeeService'),
    async = require('async'),
    _ = require('lodash');


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
        let result = {};

        coffeeService.start();

        let getWater = coffeeService.get('getWater')
            .then((getWater) => _.extend(result, { getWater }));

        let frameMug = coffeeService.get('frameMug')
            .then((frameMug) => _.extend(result, { frameMug }));

        let processCoffee = coffeeService.get('getCoffee')
            .then((getCoffee) => _.extend(result, { getCoffee }))
            .then(() => coffeeService.get('grindCoffee'))
            .then((grindCoffee) => _.extend(result, { grindCoffee }));

        let processMilk = coffeeService.get('getMilk')
            .then((getMilk) => _.extend(result, { getMilk }))
            .then(() => coffeeService.get('boilMilk'))
            .then((boilMilk) => _.extend(result, { boilMilk }));

        let pourMilk = Promise.all([ processMilk, frameMug])
            .then(() => coffeeService.get('pourMilkIntoMug'))
            .then((pourMilkIntoMug) => _.extend(result, { pourMilkIntoMug }));

        Promise.all([ getWater, processCoffee, pourMilk ])
            .then((data) => _.extend(result, data))
            .then(() => coffeeService.get('coffeeReadyToGo'))
            .then((makeCoffee) => _.extend(result, { makeCoffee }))
            .then(() => res.json({ time: coffeeService.finish(result) }));
    }

    rxJSVersion(req, res) {
        res.json({ nothing: true });
    }

    async asyncAwaitVersion(req, res) {
        let result = {};

        coffeeService.start();

        let getWater = async () =>
            result.getWater = await coffeeService.get('getWater');

        let frameMug = async () =>
            result.frameMug = await coffeeService.get('frameMug');

        let processCoffee = async () => {
            result.getCoffee = await coffeeService.get('getCoffee');
            result.grindCoffee = await coffeeService.get('grindCoffee');
        };

        let processMilk = async () => {
            result.getMilk = await coffeeService.get('getMilk');
            result.boilMilk = await coffeeService.get('boilMilk');
        };

        let pourMilk = async () => {
            await Promise.all([ processMilk(), frameMug() ]);
            result.pourMilkIntoMug = await coffeeService.get('pourMilkIntoMug');
        };

        await Promise.all([ getWater(), processCoffee(), pourMilk() ]);

        result.makeCoffee = await coffeeService.get('coffeeReadyToGo');

        res.json({ time: coffeeService.finish(result) });
    }

}

module.exports = new MainController();
