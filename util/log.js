import moment from 'moment'

function getTime() {
    return moment().utcOffset(-8).format('hh:mm:ss A')
}

export function info(msg) {
    console.log(`[INFO | ${getTime()}] ${msg}`)
}

export function error(msg) {
    console.error(`[ERROR | ${getTime()}] ${msg}`)
}

export function warn(msg) {
    console.warn(`[WARNING | ${getTime()}] ${msg}`)
}
