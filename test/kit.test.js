const assert = require('assert');
const Kit = require('..');

describe('Kit', () => {
    it('example', () => {
        let kit = Kit({
            name: () => 'slava',
            user: ({name}) => `My name is ${name}`
        });
        // console.log(kit.user) // My name is slava

        assert(kit.user === 'My name is slava');
    });

    it('construct and get', () => {

        let kit = Kit({
            Component: () => 'component-value'
        });

        assert.equal(kit.Component, 'component-value');
        assert.equal(kit.get('Component'), 'component-value');

        assert.equal(kit.NoComponent, undefined);
        assert.equal(kit.get('NoComponent'), undefined);
    })

    it('get - array of arguments', () => {

        let kit = Kit({
            Component1: () => 'component1',
            Component2: () => 'component2'
        });

        assert.deepEqual(kit.get(['Component1', 'Component2']), ['component1', 'component2']);
    })

    it('add - adds creator', () => {

        let kit = Kit();

        kit.add('Component', () => 'component')

        assert.equal(kit.Component, 'component');
        assert.equal(kit.get('Component'), 'component');

        assert.equal(kit.NoComponent, undefined);
        assert.equal(kit.get('NoComponent'), undefined);
    });

    it('create - should return new instance', () => {

        let kit = Kit();

        class TestComponent {
        }

        kit.add('Component', () => new TestComponent());

        assert.equal(kit.Component, kit.Component);
        assert.equal(kit.Component, kit.get('Component'));

        assert.notEqual(kit.Component, kit.create('Component'));
        assert(kit.get('Component') instanceof TestComponent);

        assert.notEqual(kit.create('Component'), kit.create('Component'));
    });

    it('creator - should be function', () => {

        return Promise.resolve()
            .then(() => {
                let kit = Kit();
                kit.add('Component', 'component');
            })
            .catch((err) => {
                assert.equal(err.message, "'Component' : creator is not a function");
            });
    });


    it('remove - should remove previous version', () => {

        let kit = Kit();

        class TestComponent {
        }

        kit.add('Component', () => new TestComponent());

        let Component = kit.Component;
        assert.equal(Component, kit.Component);

        kit.remove('Component');
        assert.equal(kit.Component, undefined);
    });

    it('get - should provide options in creator', () => {
        let kit = Kit();

        class TestComponent {
            constructor(options) {
                this.options = options;
            }
        }

        kit.add('Component', ({Options}) => new TestComponent(Options));

        kit.add('Options', () => {
            return {
                name: 'test',
                version: 1
            };
        });

        assert.deepEqual(kit.Component.options, {
            name: 'test',
            version: 1
        });

        assert.deepEqual(kit.Options, {
            name: 'test',
            version: 1
        });

        let {Options} = kit;
        assert.deepEqual(Options, {
            name: 'test',
            version: 1
        });
    });

    it('add - should remove previous value', () => {

        let kit = Kit();

        class TestComponent {
        }

        kit.add('Component', () => new TestComponent());
        assert(kit.Component instanceof TestComponent);

        kit.add('Component', () => 'value');

        assert.equal(kit.Component, 'value');
    });

    it('set - is alias for add', () => {

        let kit = Kit();

        class TestComponent {
        }

        kit.set('Component', () => new TestComponent());
        assert(kit.Component instanceof TestComponent);

        kit.set('Component', () => 'value');
        assert.equal(kit.Component, 'value');
    });

    it('defineDecorator - wrapper', () => {
        let kit = Kit({
            Component: () => 'component'
        });

        kit.defineDecorator((value, name) => `${value} -> ${name}`);

        assert.equal(kit.Component, 'component -> Component');
    });

    it('clone', () => {

        class TestComponent {
        }

        let kit = Kit({
            Component: () => new TestComponent()
        });

        let kit2 = Kit(kit);

        assert(kit.Component instanceof TestComponent);
        assert(kit2.Component instanceof TestComponent);

        assert.notEqual(kit.Component, kit2.Component);
    })

    it('es6 nested access', () => {
        let kit = Kit({
            user: () => {
                return {
                    name: 'slava'
                };
            },
            name: ({user: {name}}) => name
        });

        assert.equal(kit.name, 'slava');
    })

    it('keys', () => {
        let kit = Kit({
            User1: () => null,
            Name1: () => 'OK'
        });

        assert.deepEqual(Object.keys(kit), [
            'User1',
            'Name1',
            'set',
            'add',
            'get',
            'create',
            'remove',
            'defineDecorator']
        );
    })

    it('add via object', () => {
        let kit = Kit();

        kit.add({name: () => 'slava'});

        assert.equal(kit.name, 'slava')
    })


});