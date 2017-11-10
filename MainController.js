const
    coffeeService = require('./coffeeService'),
    Observable = require('rxjs/Observable').Observable,
    async = require('async');

require('rxjs/add/observable/from');
require('rxjs/add/observable/zip');
require('rxjs/add/observable/concat');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/do');


class MainController {

    main(req, res) {
        res.send(`
            <body>
                <ul>

                    <li><a href="/asyncVersion">asyncVersion</a></li>
                    <li><a href="/nativePromiseVersion">nativePromiseVersion</a></li>
                    <li><a href="/asyncAwaitVersion">asyncAwaitVersion</a></li>
                    <li><a href="/rxJSVersion">rxJSVersion</a></li>
                </ul>
            </body>
        `)
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
            pourBoiledMilkToMug: ['frameMug', 'boilMilk', (result, callback) => {
                coffeeService.get('milkInMug')
                    .then((data) => callback(null, data));
            }],
            makeCoffee: ['getWater', 'pourBoiledMilkToMug', 'grindCoffee', (result, callback) => {
                coffeeService.get('coffeeReadyToGo')
                    .then((data) => callback(null, data));
            }]
        }, (err, result) => {
            res.json({ time: coffeeService.finish(result) });
        });

    }

    nativePromiseVersion(req, res) {
        coffeeService.start();

        const getWater = coffeeService.get('water'),
            frameMug = coffeeService.get('frameMug'),
            boilMilk = coffeeService.get('milk').then(() => coffeeService.get('milkBoiled')),
            grindCoffee = coffeeService.get('coffee').then(() => coffeeService.get('coffeeGrinded')),
            pourBoiledMilkToMug = Promise.all([boilMilk, frameMug]);

        return Promise.all([getWater, grindCoffee, pourBoiledMilkToMug])
            .then((result) =>  coffeeService.get('coffeeReadyToGo'))
            .then(() => res.json({ time: coffeeService.finish()}))
            .catch((err) => res.json(err));
    }

    asyncAwaitVersion(req, res) {
        res.json({ nothing: true });
    }

    rxJSVersion(req, res) {
        coffeeService.start();

        const getWater$ = Observable.from(coffeeService.get('water'));

        const frameMug$ = Observable.from(coffeeService.get('frameMug'));

        const boilMilk$ = Observable.from(coffeeService.get('milk'))
            .switchMap(() => Observable.from(coffeeService.get('milkBoiled')));

        const grindCofee$ = Observable.from(coffeeService.get('coffe'))
            .switchMap(() => Observable.from(coffeeService.get('coffeeGrinded')));

        const pourBoiledMilkToMug$ = Observable.zip(boilMilk$, frameMug$);


        Observable.zip(getWater$, grindCofee$, pourBoiledMilkToMug$)
            .switchMap(() => Observable.from(coffeeService.get('coffeeReadyToGo')))
            .subscribe(
                val => res.json({ time: coffeeService.finish() }),
                err => res.json({ err: err.message || 'ERROR' }),
                () => console.log('done')
            );
    }
}

module.exports = new MainController();
