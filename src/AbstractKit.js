module.exports = class AbstractKit {
    constructor(creators = {}) {
        this.__kit = {
            creators: {},
            values: {},
            decorator: (value, name) => value
        };

        if (creators instanceof AbstractKit) {
            creators = creators.__kit.creators;
        }

        for (let creator in creators) {
            this.add(creator, creators[creator]);
        }
    }

    set(name, creator) {
        return this.add(name, creator);
    }

    add(name, creator) {
        throw Error('Not Implemented');
    }

    get(name) {
        throw Error('Not Implemented');
    }

    create(name) {
        throw Error('Not Implemented');
    }

    remove(name) {
        throw Error('Not Implemented');
    }

    defineDecorator(decorator) {
        throw Error('Not Implemented');
    }
};
