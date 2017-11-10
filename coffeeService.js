const
    moment = require('moment');


class CookingService {
    constructor() {
        this.startTime = null;
    }

    start() {
        this.startTime = moment();
    }

    finish(result) {
        return {
            result,
            totalTime: moment().diff(this.startTime, 'seconds')
        }
    }

    get(param) {
        return new Promise((resolve, reject) => {
            const time = this.randomTime();
            setTimeout(() => {
                resolve({
                    param,
                    time
                });
            }, time);
        });
    }

    randomTime() {
        return Math.round(Math.random() * 50) * 100;
    }

}

module.exports = new CookingService();
