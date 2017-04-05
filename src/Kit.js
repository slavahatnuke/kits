module.exports = class Kit {
    constructor(creators = {}) {
        this.__kit = {
            creators: {},
            values: {},
            decorator: (value, name) => value
        };

        if (creators instanceof Kit) {
            creators = creators.__kit.creators;
        }

        for (let creator in creators) {
            this.add(creator, creators[creator]);
        }

        this.set = this.set.bind(this);
        this.add = this.add.bind(this);
        this.get = this.get.bind(this);
        this.create = this.create.bind(this);
        this.remove = this.remove.bind(this);
        this.defineDecorator = this.defineDecorator.bind(this);
    }

    set(name, creator) {
        return this.add(name, creator);
    }

    add(name, creator) {
        if (creator instanceof Function) {
            this.remove(name);

            if (this.__kit.creators[name] === undefined) {
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
            if (Array.isArray(name)) {
                return name.map((name) => this.get(name));
            }

            if (this.__kit.values[name] === undefined) {
                this.__kit.values[name] = this.create(name);
            }

            return this.__kit.values[name];
        })();
    }

    create(name) {
        return (() => {
            if (this.__kit.creators[name]) {
                let value = this.__kit.creators[name](this);
                return this.__kit.decorator(value, name);
            }

            return undefined;
        })();
    }

    remove(name) {
        if (this.__kit.values[name] !== undefined) {
            delete this.__kit.values[name];
        }

        if (this.__kit.creators[name]) {
            this.__kit.creators[name] = null;
        }
    }

    defineDecorator(decorator) {
        if (decorator instanceof Function) {
            this.__kit.decorator = (value, name) => decorator(value, name);
        }
    }
};
