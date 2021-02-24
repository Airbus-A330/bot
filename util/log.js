const moment = require('moment')

module.exports = {
    info(msg) {
        const time = moment().utcOffset(-8).format('hh:mm:ss A');
        console.log(`[INFO | ${time}] ${msg}`);
    },
    error(msg) {
        const time = moment().utcOffset(-8).format('hh:mm:ss A');
        console.error(`[ERROR | ${time}] ${msg}`);
    },
    warn(msg) {
      const time = moment().utcOffset(-8).format('hh:mm:ss A');
        console.warn(`[WARNING | ${time}] ${msg}`);
    }
}