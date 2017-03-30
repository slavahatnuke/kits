const assert = require('assert');
const Kit = require('../async');

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

    // it('create - should return new instance', () => {
    //
    //     let kit = Kit();
    //
    //     class TestComponent {
    //     }
    //
    //     kit.add('Component', () => {
    //         console.log('>>>new one');
    //         return Promise.resolve().then(() => new TestComponent())
    //     });
    //
    //     return Promise.resolve()
    //         .then(() => {
    //             console.log(kit.Component);
    //             console.log(kit.Component);
    //             console.log(kit.Component);
    //
    //             return Promise.all([kit.Component, kit.Component])
    //                 .then(([c1, c2]) => {
    //                     console.log({c1, c2});
    //
    //                     assert(c1 instanceof TestComponent);
    //                     assert(c2 instanceof TestComponent);
    //                     assert.equal(c1, c2);
    //                 });
    //         })
    //         // .then(() => {
    //         //     return Promise.all([kit.Component, kit.create('Component')])
    //         //         .then(([c1, c2]) => {
    //         //             assert(c1 instanceof TestComponent);
    //         //             assert(c2 instanceof TestComponent);
    //         //             assert.notEqual(c1, c2);
    //         //         });
    //         // })
    //         ;
    // });
    //
    // it('creator - should be function', () => {
    //
    //     return Promise.resolve()
    //         .then(() => {
    //             let kit = Kit();
    //             return kit.add('Component', 'component');
    //         })
    //         .catch((err) => {
    //             assert.equal(err.message, "'Component' : creator is not a function");
    //         });
    // });
    //
    //
    // it('remove - should remove previous version', () => {
    //
    //     let kit = Kit();
    //
    //     class TestComponent {
    //     }
    //
    //     kit.add('Component', () => new TestComponent());
    //
    //     let Component = kit.Component;
    //     assert.equal(Component, kit.Component);
    //
    //     kit.remove('Component');
    //     assert.notEqual(Component, kit.Component);
    //
    //     assert(Component instanceof TestComponent);
    //     assert(kit.Component instanceof TestComponent);
    // });
    //
    // it('get - should provide options in creator', () => {
    //     let kit = Kit();
    //
    //     class TestComponent {
    //         constructor(options) {
    //             this.options = options;
    //         }
    //     }
    //
    //     kit.add('Component', ({Options}) => new TestComponent(Options));
    //
    //     kit.add('Options', () => {
    //         return {
    //             name: 'test',
    //             version: 1
    //         };
    //     });
    //
    //     assert.deepEqual(kit.Component.options, {
    //         name: 'test',
    //         version: 1
    //     });
    // });
    //
    // it('add - should remove previous value', () => {
    //
    //     let kit = Kit();
    //
    //     class TestComponent {
    //     }
    //
    //     kit.add('Component', () => new TestComponent());
    //     assert(kit.Component instanceof TestComponent);
    //
    //     kit.add('Component', () => 'value');
    //
    //     assert.equal(kit.Component, 'value');
    // });
    //
    // it('set - is alias for add', () => {
    //
    //     let kit = Kit();
    //
    //     class TestComponent {
    //     }
    //
    //     kit.set('Component', () => new TestComponent());
    //     assert(kit.Component instanceof TestComponent);
    //
    //     kit.set('Component', () => 'value');
    //     assert.equal(kit.Component, 'value');
    // });
    //
    // it('decorate - wrapper', () => {
    //
    //     let kit = Kit({
    //         Component: () => 'component'
    //     });
    //
    //     kit.decorate((value, name) => `${value} -> ${name}`);
    //
    //     assert.equal(kit.Component, 'component -> Component');
    // })
    //

});