module.exports = {
    getId(str) {
        return ((str || "").match(/\d+/g) || [])[0];
    }
}