let AbstractKit = require('./AbstractKit');

module.exports = class AsyncKit extends AbstractKit {
    constructor(creators = {}) {
        super(creators);

        this.__kit = Object.assign(this.__kit, {
            promises: {}
        });
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
        if (Array.isArray(name)) {
            return Promise.all(name.map((name) => this.get(name)));
        }

        if (this.__kit.promises[name]) {
            return this.__kit.promises[name];
        }

        let resolver = (value) => value;
        let rejecter = (err) => Promise.reject(err);

        let promise = new Promise((resolve, reject) => {
            resolver = resolve;
            rejecter = reject;
        });

        this.__kit.promises[name] = promise;

        Promise.resolve()
            .then(() => {
                if (this.__kit.values[name] === undefined) {

                    return this.create(name)
                        .then((value) => {
                            this.__kit.values[name] = value;
                            return value;
                        });
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
            })
            .then(resolver)
            .catch(rejecter);

        return promise;
    }

    create(name) {
        return (() => {
            return Promise.resolve()
                .then(() => {
                    if (this.__kit.creators[name]) {
                        return Promise.resolve()
                            .then(() => this.__kit.creators[name](this))
                            .then((value) => this.__kit.decorator(value, name));
                    }

                    return undefined;
                });
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
