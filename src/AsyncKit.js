module.exports = class AsyncKit {
    constructor(creators = {}) {
        this.__kit = {
            creators: {},
            values: {},
            promises: {},
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
        return Promise.resolve()
            .then(() => {
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
            });
    }

    get(name) {
        return (() => {
            if (Array.isArray(name)) {
                return Promise.all(name.map((name) => this.get(name)));
            }

            // if (this.__kit.promises[name] !== undefined) {
            //     return this.__kit.promises[name];
            // }

            this.__kit.promises[name] = Promise.resolve();

            return this.__kit.promises[name]
                .then(() => {
                    if (this.__kit.values[name] === undefined) {

                        return this.__kit.promises[name]
                            .then(() => this.create(name))
                            .then((value) => {
                                this.__kit.values[name] = value;
                                return value;
                            })
                    }

                    return this.__kit.values[name];
                })
                .then((value) => {
                    if (this.__kit.promises[name]) {
                        delete this.__kit.promises[name];
                    }
                    return value;
                })
                .catch((error) => {
                    if (this.__kit.promises[name]) {
                        delete this.__kit.promises[name];
                    }
                    return Promise.reject(error);
                });

        })();
    }

    create(name) {
        return Promise.resolve()
            .then(() => {
                if (this.__kit.creators[name]) {
                    return Promise.resolve()
                        .then(() => this.__kit.values[name] || this.__kit.creators[name](this))
                        .then((value) => this.__kit.decorator(value, name));
                }

                return undefined;
            });
    }

    remove(name) {
        return Promise.resolve()
            .then(() => {
                if (this.__kit.values[name] !== undefined) {
                    delete this.__kit.values[name];
                }
            });
    }

    decorate(decorator) {
        return Promise.resolve()
            .then(() => {
                if (decorator instanceof Function) {
                    this.__kit.decorator = (value, name) => decorator(value, name);
                }
            });
    }
};
