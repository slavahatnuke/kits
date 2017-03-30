module.exports = class Kit {
    constructor(creators = {}) {
        this.__kit = {
            creators: {},
            values: {}
        };

        for (let creator in creators) {
            this.add(creator, creators[creator]);
        }

    }

    add(name, creator) {
        if (creator instanceof Function) {
            this.remove(name);

            if (!this.__kit.creators[name]) {
                Object.defineProperty(this, name, {
                    get: () => this.get(name)
                });
            }

            this.__kit.creators[name] = creator;
        } else {
            throw new Error(`'${name}' : creator is not a function`)
        }

        return this;
    }

    get(name) {
        if (this.__kit.values[name] === undefined) {
            this.__kit.values[name] = this.create(name);
        }

        return this.__kit.values[name];
    }

    create(name) {
        if (this.__kit.creators[name]) {
            return this.__kit.creators[name](this);
        }

        return undefined;
    }

    remove(name) {
        if (this.__kit.values[name] !== undefined) {
            delete this.__kit.values[name];
        }
    }
};
