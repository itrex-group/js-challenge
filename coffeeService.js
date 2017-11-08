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
        return moment().diff(this.startTime, 'seconds');
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
