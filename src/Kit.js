module.exports = class Kit {
    constructor(creators = {}) {
        this.__kit = {
            creators: {},
            values: {},
            decorator: (value, name) => value
        };

        for (let creator in creators) {
            this.add(creator, creators[creator]);
        }

    }

    set(name, creator) {
        return this.add(name, creator);
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
        return (() => {
            if(Array.isArray(name)) {
                return name.map((name) => this.get(name));
            }

            if (this.__kit.values[name] === undefined) {
                this.__kit.values[name] = this.create(name);
            }

            return this.__kit.values[name];
        })();
    }

    create(name) {
        if (this.__kit.creators[name]) {
            let value = this.__kit.creators[name](this);
            return this.__kit.decorator(value, name);
        }

        return undefined;
    }

    remove(name) {
        if (this.__kit.values[name] !== undefined) {
            delete this.__kit.values[name];
        }
    }

    decorate(decorator) {
        if(decorator instanceof Function) {
            this.__kit.decorator = (value, name) => decorator(value, name);
        }
    }
};
