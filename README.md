# kits
This is a kits pattern. Main idea of this to have registry and lightweight injections. 

Main idea is:
```javascript
	let kit = Kit({
	    name: () => 'slava',
	    user: ({name}) => `My name is ${name}`
	});
	// console.log(kit.user) // My name is slava
	
	assert(kit.user === 'My name is slava');
```

## Spec
```javascript
const assert = require('assert');
const Kit = require('kits');

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

});
```


## Async Spec
```javascript
const assert = require('assert');
const Kit = require('kits/async');

describe('Async Kit', () => {
    it('construct and get', () => {
        let kit = Kit({
            Component: () => 'component'
        });

        return Promise.resolve()
            .then(() => {
                return kit.Component
                    .then((value) => {
                        assert.equal(value, 'component');
                    })
            })
            .then(() => kit.NoComponent)
            .then((value) => assert.equal(value, undefined));
    });


    it('get - array of arguments', () => {

        let kit = Kit({
            Component1: () => Promise.resolve().then(() => 'component1'),
            Component2: () => 'component2'
        });

        return kit.get(['Component1', 'Component2'])
            .then((values) => {
                assert.deepEqual(values, ['component1', 'component2']);
            });
    });


    it('add - adds creator', () => {

        let kit = Kit();
        kit.add('Component', () => 'component');

        return kit.get('Component')
            .then((value) => {
                assert.equal(value, 'component');
            });
    });

    it('create - should return new instance', () => {

        let kit = Kit();

        class TestComponent {
        }

        kit.add('Component', () => {
            return Promise.resolve().then(() => new TestComponent())
        });

        return Promise.resolve()
            .then(() => {
                return Promise.all([kit.Component, kit.Component])
                    .then(([c1, c2]) => {
                        assert(c1 instanceof TestComponent);
                        assert(c2 instanceof TestComponent);
                        assert.equal(c1, c2);
                    });
            })
            .then(() => {
                return Promise.all([kit.Component, kit.create('Component')])
                    .then(([c1, c2]) => {
                        assert(c1 instanceof TestComponent);
                        assert(c2 instanceof TestComponent);
                        assert.notEqual(c1, c2);
                    });
            });
    });

    it('creator - should be function', () => {

        return Promise.resolve()
            .then(() => {
                let kit = Kit();
                return kit.add('Component', 'component');
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

        return kit.Component
            .then((value) => {
                assert(value instanceof TestComponent);
                kit.remove('Component');
            })
            .then(() => kit.Component)
            .then((value) => {
                assert.equal(value, undefined);
            });
    });

    it('get - should provide options in creator', () => {
        let kit = Kit();

        class TestComponent {
            constructor(options) {
                this.options = options;
            }
        }

        kit.add('Component', ({get}) => {
            return get('Options')
                .then((options) => new TestComponent(options));
        });

        kit.add('Options', () => {
            return Promise.resolve()
                .then(() => {
                    return {
                        name: 'test',
                        version: 1
                    }
                });
        });

        return kit.Component
            .then((component) => {
                assert.deepEqual(component.options, {
                    name: 'test',
                    version: 1
                });
            });
    });

    it('add - should remove previous value', () => {

        let kit = Kit();

        class TestComponent {
        }

        kit.add('Component', () => new TestComponent());

        return Promise.resolve()
            .then(() => {
                return kit.Component
                    .then((value) => {
                        assert(value instanceof TestComponent);
                    })
            })
            .then(() => {
                kit.add('Component', () => 'value');
                return kit.get('Component')
                    .then((value) => {
                        assert.equal(value, 'value');
                    })
            })
    });

    it('set - is alias for add', () => {

        let kit = Kit();

        class TestComponent {
        }

        kit.set('Component', () => new TestComponent());

        return kit.Component
            .then((Component) => {
                assert(Component instanceof TestComponent);
            });
    });

    it('decorate - wrapper', () => {

        let kit = Kit({
            Component: () => 'component'
        });

        kit.defineDecorator((value, name) => Promise.resolve().then(() => `${value} -> ${name}`));

        return kit.Component
            .then((Component) => {
                assert.equal(Component, 'component -> Component');
            })
    });

    it('clone', () => {

        class TestComponent {
        }

        let kit = Kit({
            Component: () => new TestComponent()
        });

        let kit2 = Kit(kit);

        return Promise.resolve()
            .then(() => {
                return Promise.all([kit.Component, kit2.Component])
                    .then(([c1, c2]) => {
                        assert(c1 instanceof TestComponent);
                        assert(c2 instanceof TestComponent);

                        assert.notEqual(c1, c2);
                    });
            });
    })
});
```