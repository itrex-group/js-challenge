const
    moment = require('moment');


class CookingService {
    constructor() {
        this.startTime = null;
    }

    start() {
        this.startTime = moment();
    }

    finish(obj) {
        if (obj.getMilk && obj.getWater && obj.getCoffee && obj.boilMilk && obj.grindCoffee && obj.frameMug && obj.makeCoffee) {
            return moment().diff(this.startTime, 'seconds');
        }
        return new Error('Coffee not ready, sorry');
    }

    get(param) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, this.randomTime());
        });
    }

    randomTime() {
        return Math.round(Math.random() * 50) * 100;
    }

}

module.exports = new CookingService();
