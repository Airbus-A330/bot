const version = "1.3.0";

module.exports = class Store {
    constructor({
        reset,
        limit
    }) {
        if (isNaN(limit) || isNaN(reset)) {
            throw new Error("Limit and Reset values must be valid integers");
        }
        Object.assign(this, {
            store: new Map(),
            data: {
                limit: parseInt(limit),
                reset: parseInt(reset)
            }
        });
    }

    reset(id) {
        this.store.set(id, {
            count: 0,
            nextReset: Date.now() + this.data.reset
        });
    }

    canUse(id) {
        const { count } = this._ensure(id);
        return count < this.data.limit;
    }

    increment(id) {
        const { count, nextReset } = this._ensure(id);
        this.store.set(id, {
            count: count + 1,
            nextReset
        });
    }

    _ensure(id) {
        const data = this.store.get(id);
        if (!data || data.nextReset <= Date.now()) {
            this.reset(id);
        }
        return this.store.get(id);
    }

    static get version() {
        return version;
    }
}