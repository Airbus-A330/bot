/**
 *
 * @param {string} str String to match a user ID in.
 * @returns number|null The user ID found
 */
export function getId(str = '') {
    return (function (m = str.match(/\d+/g)) {
        return m.length > 0 ? parseInt(m[0]) : null
    })()
}

export function sleep(timeout) {
    return new Promise(function(resolve, reject) { return setTimeout(resolve, timeout)})
}